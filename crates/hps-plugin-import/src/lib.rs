#![allow(clippy::not_unsafe_ptr_arg_deref)]
use modularize_imports::ImportOptions;
use serde::Deserialize;
use swc_core::{
    ecma::ast::Program,
    plugin::{plugin_transform, proxies::TransformPluginProgramMetadata},
};

#[derive(Debug, Deserialize, Default, Clone)]
#[serde(rename_all = "camelCase")]
pub struct ImportInputOptions {
    pub modular_imports: Vec<ImportOptions>,
}

#[plugin_transform]
fn swc_plugin_import(program: Program, data: TransformPluginProgramMetadata) -> Program {
    let config_str = data
        .get_transform_plugin_config()
        .expect("failed to get swc-plugin-import options");

    let import_input_options = match serde_json::from_str::<ImportInputOptions>(&config_str) {
        Ok(options) => options,
        Err(err) => panic!("invalid swc-plugin-import options: {:?}", err),
    };

    let import_options = import_input_options.modular_imports;

    let mut custom_import_options = vec![];
    for i in 0..import_options.len() {
        let mut option = import_options[i].clone();

        if option.method_name_to_files.is_some() {
            let method_name_to_files = option.method_name_to_files.clone();

            option.custom_name = Some(modularize_imports::CustomTransform::Fn(Box::new(
                move |name| {
                    if let Some(map) = &method_name_to_files {
                        if let Some(val) = map.get(&name) {
                            return Some(val.clone());
                        }
                    }
                    None
                },
            )));
        }
        custom_import_options.push(option);
    }

    return program.apply(modularize_imports::plugin_import(&custom_import_options));
}
