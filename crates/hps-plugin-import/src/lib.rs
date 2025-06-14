use serde::Deserialize;
use swc_core::{
    ecma::{ast::*, visit::VisitMutWith},
    plugin::{plugin_transform, proxies::TransformPluginProgramMetadata},
};
use transform_source::InspectorPlugin;

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PluginConfig {
    #[serde(default)]
    pub project_cwd: Option<String>,
}

/// SWC plugin for code transform
///
/// This plugin adds source location information to JSX elements
/// by injecting a `data-hps-source` attribute with file path,
/// line number, and column number.
#[plugin_transform]
pub fn inspector_swc_plugin(program: Program, metadata: TransformPluginProgramMetadata) -> Program {
    // Parse plugin config with defaults
    let config: PluginConfig = metadata
        .get_transform_plugin_config()
        .and_then(|config_str| serde_json::from_str::<PluginConfig>(&config_str).ok())
        .unwrap_or_else(|| PluginConfig { project_cwd: None });

    let source_map = metadata.source_map;
    let project_cwd = config.project_cwd.clone();

    let mut visitor = InspectorPlugin::new(project_cwd, source_map);
    let mut program = program;
    program.visit_mut_with(&mut visitor);
    program
}
