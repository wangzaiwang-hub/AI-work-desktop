import re
from collections.abc import Callable

from fastopenapi.routers import FlaskRouter
from flask import Response, jsonify, request
from flask_cors import CORS

from configs import dify_config
from controllers.fastopenapi import console_router
from dify_app import DifyApp
from extensions.ext_blueprints import AUTHENTICATED_HEADERS, EXPOSED_HEADERS


def _patched_add_route(self: FlaskRouter, path: str, method: str, endpoint: Callable) -> None:
    """Patch FlaskRouter.add_route to handle Flask Response objects from decorators."""
    from fastopenapi.base_router import BaseRouter

    BaseRouter.add_route(self, path, method, endpoint)
    if self.app is not None:
        flask_path = re.sub(r"{(\w+)}", r"<\1>", path)

        def view_func(**path_params):
            json_data = request.get_json(silent=True) or {}
            query_params = {}
            for key in request.args:
                values = request.args.getlist(key)
                query_params[key] = values[0] if len(values) == 1 else values
            all_params = {**query_params, **path_params}
            body = json_data
            try:
                kwargs = self.resolve_endpoint_params(endpoint, all_params, body)
            except Exception as e:
                error_response = self.handle_exception(e)
                return jsonify(error_response), getattr(e, "status_code", 422)

            try:
                result = endpoint(**kwargs)
            except Exception as e:
                error_response = self.handle_exception(e)
                return jsonify(error_response), getattr(e, "code", 500)

            # If decorators returned a Response directly, pass it through
            if isinstance(result, Response):
                return result

            meta = getattr(endpoint, "__route_meta__", {})
            status_code = meta.get("status_code", 200)
            result = self._serialize_response(result)
            return jsonify(result), status_code

        self.app.add_url_rule(flask_path, endpoint.__name__, view_func, methods=[method.upper()])


FlaskRouter.add_route = _patched_add_route

DOCS_PREFIX = "/fastopenapi"


def init_app(app: DifyApp) -> None:
    docs_enabled = dify_config.SWAGGER_UI_ENABLED
    docs_url = f"{DOCS_PREFIX}/docs" if docs_enabled else None
    redoc_url = f"{DOCS_PREFIX}/redoc" if docs_enabled else None
    openapi_url = f"{DOCS_PREFIX}/openapi.json" if docs_enabled else None

    router = FlaskRouter(
        app=app,
        docs_url=docs_url,
        redoc_url=redoc_url,
        openapi_url=openapi_url,
        openapi_version="3.0.0",
        title="Dify API (FastOpenAPI PoC)",
        version="1.0",
        description="FastOpenAPI proof of concept for Dify API",
    )

    # Ensure route decorators are evaluated.
    import controllers.console.init_validate as init_validate_module
    import controllers.console.ping as ping_module
    from controllers.console import remote_files, setup

    _ = init_validate_module
    _ = ping_module
    _ = remote_files
    _ = setup

    router.include_router(console_router, prefix="/console/api")
    CORS(
        app,
        resources={r"/console/api/.*": {"origins": dify_config.CONSOLE_CORS_ALLOW_ORIGINS}},
        supports_credentials=True,
        allow_headers=list(AUTHENTICATED_HEADERS),
        methods=["GET", "PUT", "POST", "DELETE", "OPTIONS", "PATCH"],
        expose_headers=list(EXPOSED_HEADERS),
    )
    app.extensions["fastopenapi"] = router
