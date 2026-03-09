// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::os::windows::process::CommandExt;
use tauri::Manager;
use tauri_plugin_shell::ShellExt;
use tauri_plugin_shell::process::CommandChild;
use std::sync::Mutex;
use std::time::Duration;

struct ManagedChild {
    child: Mutex<Option<CommandChild>>,
    we_started_it: Mutex<bool>,
}

// ===== 文件系统 Commands =====

#[derive(serde::Serialize)]
struct SandboxFileInfo {
    name: String,
    size: u64,
    created_at: String,
}

#[tauri::command]
fn sandbox_write_file(dir: String, file_name: String, content: String) -> Result<String, String> {
    let dir_path = std::path::Path::new(&dir);
    if !dir_path.exists() {
        std::fs::create_dir_all(dir_path).map_err(|e| format!("创建目录失败: {}", e))?;
    }
    let file_path = dir_path.join(&file_name);
    std::fs::write(&file_path, &content).map_err(|e| format!("写入文件失败: {}", e))?;
    Ok(file_path.to_string_lossy().to_string())
}

#[tauri::command]
fn sandbox_read_file(path: String) -> Result<String, String> {
    std::fs::read_to_string(&path).map_err(|e| format!("读取文件失败: {}", e))
}

#[tauri::command]
fn sandbox_list_files(dir: String) -> Result<Vec<SandboxFileInfo>, String> {
    let dir_path = std::path::Path::new(&dir);
    if !dir_path.exists() {
        return Ok(vec![]);
    }
    let mut files = Vec::new();
    let entries = std::fs::read_dir(dir_path).map_err(|e| format!("读取目录失败: {}", e))?;
    for entry in entries {
        if let Ok(entry) = entry {
            if let Ok(meta) = entry.metadata() {
                if meta.is_file() {
                    let created = meta.created()
                        .map(|t| {
                            let dt: chrono::DateTime<chrono::Local> = t.into();
                            dt.format("%Y-%m-%dT%H:%M:%S").to_string()
                        })
                        .unwrap_or_default();
                    files.push(SandboxFileInfo {
                        name: entry.file_name().to_string_lossy().to_string(),
                        size: meta.len(),
                        created_at: created,
                    });
                }
            }
        }
    }
    files.sort_by(|a, b| b.created_at.cmp(&a.created_at));
    Ok(files)
}

#[tauri::command]
fn sandbox_delete_file(path: String) -> Result<(), String> {
    std::fs::remove_file(&path).map_err(|e| format!("删除文件失败: {}", e))
}

#[tauri::command]
fn sandbox_ensure_dir(dir: String) -> Result<bool, String> {
    let dir_path = std::path::Path::new(&dir);
    if !dir_path.exists() {
        std::fs::create_dir_all(dir_path).map_err(|e| format!("创建目录失败: {}", e))?;
    }
    Ok(dir_path.exists() && dir_path.is_dir())
}

fn is_port_in_use(port: u16) -> bool {
    // 尝试连接而不是绑定，这样可以检测到任何监听的服务
    use std::net::TcpStream;
    use std::time::Duration;
    
    // 尝试 IPv4
    if TcpStream::connect_timeout(
        &std::net::SocketAddr::from(([127, 0, 0, 1], port)),
        Duration::from_millis(100)
    ).is_ok() {
        return true;
    }
    
    // 尝试 IPv6
    if TcpStream::connect_timeout(
        &std::net::SocketAddr::from(([0, 0, 0, 0, 0, 0, 0, 1], port)),
        Duration::from_millis(100)
    ).is_ok() {
        return true;
    }
    
    false
}

async fn wait_for_server(port: u16, max_attempts: u32) -> bool {
    for i in 0..max_attempts {
        if is_port_in_use(port) {
            return true;
        }
        if i % 10 == 0 {
            log::info!("Waiting for server on port {}... ({}/{})", port, i, max_attempts);
        }
        tokio::time::sleep(Duration::from_millis(500)).await;
    }
    false
}

fn navigate_to(app_handle: &tauri::AppHandle, port: u16) {
    if let Some(window) = app_handle.get_webview_window("main") {
        let url = format!("http://localhost:{}", port);
        let _ = window.eval(&format!("window.location.href = '{}'", url));
    }
}

fn get_web_dir() -> String {
    if let Ok(exe_path) = std::env::current_exe() {
        if let Some(parent) = exe_path.parent() {
            // dev: web/src-tauri/target/release/app.exe -> web/
            if let Ok(web_path) = parent.join("..").join("..").join("..").canonicalize() {
                if web_path.join("package.json").exists() {
                    return web_path.to_string_lossy().to_string();
                }
            }
        }
    }
    if let Ok(cwd) = std::env::current_dir() {
        if cwd.join("package.json").exists() {
            return cwd.to_string_lossy().to_string();
        }
        let web_dir = cwd.join("web");
        if web_dir.join("package.json").exists() {
            return web_dir.to_string_lossy().to_string();
        }
    }
    ".".to_string()
}

fn kill_port_3000() {
    // 用 PowerShell 精确杀掉监听 3000 端口的进程
    let _ = std::process::Command::new("powershell")
        .args([
            "-NoProfile", "-Command",
            "Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }"
        ])
        .creation_flags(0x08000000)
        .spawn();
}

fn main() {
    let managed = ManagedChild {
        child: Mutex::new(None),
        we_started_it: Mutex::new(false),
    };

    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .manage(managed)
        .invoke_handler(tauri::generate_handler![
            sandbox_write_file,
            sandbox_read_file,
            sandbox_list_files,
            sandbox_delete_file,
            sandbox_ensure_dir,
        ])
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }

            let app_handle = app.handle().clone();
            let port: u16 = 3000;

            tauri::async_runtime::spawn(async move {
                // 前端已在运行，直接跳转
                if is_port_in_use(port) {
                    log::info!("Frontend already running on port {}", port);
                    navigate_to(&app_handle, port);
                    return;
                }

                log::info!("Starting Next.js dev server...");
                let shell = app_handle.shell();
                let web_dir = get_web_dir();

                match shell
                    .command("cmd")
                    .args(["/C", "pnpm", "dev"])
                    .current_dir(web_dir)
                    .spawn()
                {
                    Ok((_, child)) => {
                        let state = app_handle.state::<ManagedChild>();
                        *state.child.lock().unwrap() = Some(child);
                        *state.we_started_it.lock().unwrap() = true;
                        log::info!("pnpm dev process spawned");
                    }
                    Err(e) => {
                        log::error!("Failed to start pnpm dev: {}", e);
                        return;
                    }
                }

                if wait_for_server(port, 240).await {
                    log::info!("Next.js server ready on port {}", port);
                    tokio::time::sleep(Duration::from_secs(2)).await;
                    navigate_to(&app_handle, port);
                } else {
                    log::error!("Next.js server failed to start");
                    if let Some(window) = app_handle.get_webview_window("main") {
                        let _ = window.eval(
                            "document.getElementById('status').textContent = \
                             'Failed to start frontend. Please run pnpm dev manually.';"
                        );
                    }
                }
            });

            Ok(())
        })
        .build(tauri::generate_context!())
        .expect("error while building tauri application")
        .run(|app_handle, event| {
            if let tauri::RunEvent::Exit = event {
                let state = app_handle.state::<ManagedChild>();
                let we_started = *state.we_started_it.lock().unwrap();

                // 只杀我们自己启动的进程
                if we_started {
                    if let Some(child) = state.child.lock().unwrap().take() {
                        log::info!("Killing frontend child process...");
                        let _ = child.kill();
                    }
                    // 保险：杀掉 3000 端口残留进程
                    kill_port_3000();
                    log::info!("Frontend process cleaned up");
                }
            }
        });
}
