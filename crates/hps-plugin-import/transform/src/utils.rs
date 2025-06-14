use pathdiff::diff_paths;
use swc_core::{common::BytePos, ecma::ast::*};

pub fn get_file_info(
    project_cwd: Option<String>,
    source_map: &swc_core::plugin::proxies::PluginSourceMapProxy,
    pos: BytePos,
) -> (u32, u32, String) {
    let loc = source_map.get_code_map().lookup_char_pos(pos);
    let mut file_name = loc.file.name.to_string();
    if file_name.starts_with("[project]/") {
        file_name = file_name["[project]/".len()..].to_string();
    }
    if let Some(project_cwd) = project_cwd.clone() {
        file_name = assert_file_absolute_path(&file_name, project_cwd.clone());
    }
    (loc.line as u32, (loc.col_display + 1) as u32, file_name)
}

pub fn assert_file_absolute_path(file_path: &str, project_cwd: String) -> String {
    // Get the absolute path of the file being processed
    diff_paths(&file_path, project_cwd)
        .map(|p| p.to_string_lossy().into_owned())
        .unwrap_or_else(|| file_path.to_string())
}
