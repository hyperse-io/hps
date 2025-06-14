mod utils;

use crate::utils::get_file_info;
use swc_core::{
    common::{SyntaxContext, DUMMY_SP},
    ecma::{
        ast::*,
        visit::{VisitMut, VisitMutWith},
    },
};

const TRACE_SOURCE: &str = "data-hps-source";

pub struct InspectorPlugin {
    #[allow(dead_code)]
    project_cwd: Option<String>,
    file_name_identifier: Option<Ident>,
    source_map: swc_core::plugin::proxies::PluginSourceMapProxy,
}

impl InspectorPlugin {
    pub fn new(
        project_cwd: Option<String>,
        source_map: swc_core::plugin::proxies::PluginSourceMapProxy,
    ) -> Self {
        Self {
            project_cwd,
            file_name_identifier: None,
            source_map,
        }
    }
}

impl VisitMut for InspectorPlugin {
    fn visit_mut_jsx_opening_element(&mut self, el: &mut JSXOpeningElement) {
        let (line, col, filename) =
            get_file_info(self.project_cwd.clone(), &self.source_map, el.span.lo);

        // Skip if element has no location info or already has data-hps-source
        if el.span.is_dummy()
            || el.attrs.iter().any(|attr| {
                if let JSXAttrOrSpread::JSXAttr(attr) = attr {
                    if let JSXAttrName::Ident(ident) = &attr.name {
                        return ident.sym == TRACE_SOURCE;
                    }
                }
                false
            })
        {
            return;
        }

        // Create file name identifier if not exists
        if self.file_name_identifier.is_none() {
            self.file_name_identifier = Some(Ident::new(
                filename.clone().into(),
                DUMMY_SP,
                SyntaxContext::empty(),
            ));
        }

        // Add data-hps-file-name attribute
        el.attrs.push(JSXAttrOrSpread::JSXAttr(JSXAttr {
            span: DUMMY_SP,
            name: JSXAttrName::Ident(
                Ident::new(TRACE_SOURCE.into(), DUMMY_SP, SyntaxContext::empty()).into(),
            ),
            value: Some(JSXAttrValue::JSXExprContainer(JSXExprContainer {
                span: DUMMY_SP,
                expr: JSXExpr::Expr(Box::new(Expr::Lit(Lit::Str(Str {
                    span: DUMMY_SP,
                    value: format!(
                        "{}:{}:{}:{}",
                        filename.clone(),
                        line,
                        col,
                        match &el.name {
                            JSXElementName::Ident(ident) => ident.sym.to_string(),
                            JSXElementName::JSXMemberExpr(member) => member.prop.sym.to_string(),
                            JSXElementName::JSXNamespacedName(namespaced) =>
                                namespaced.name.sym.to_string(),
                        }
                    )
                    .into(),
                    raw: None,
                })))),
            })),
        }));

        el.visit_mut_children_with(self);
    }

    fn visit_mut_module(&mut self, module: &mut Module) {
        let (_, _, filename) =
            get_file_info(self.project_cwd.clone(), &self.source_map, module.span.lo);

        // Add file name variable declaration at the start of the module
        if let Some(file_name_id) = &self.file_name_identifier {
            module.body.insert(
                0,
                ModuleItem::Stmt(Stmt::Decl(Decl::Var(Box::new(VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Var,
                    declare: false,
                    decls: vec![VarDeclarator {
                        span: DUMMY_SP,
                        name: Pat::Ident(BindingIdent {
                            id: file_name_id.clone(),
                            type_ann: None,
                        }),
                        init: Some(Box::new(Expr::Lit(Lit::Str(Str {
                            span: DUMMY_SP,
                            value: filename.clone().into(),
                            raw: None,
                        })))),
                        definite: false,
                    }],
                    ctxt: SyntaxContext::empty(),
                })))),
            );
        }

        module.visit_mut_children_with(self);
    }
}
