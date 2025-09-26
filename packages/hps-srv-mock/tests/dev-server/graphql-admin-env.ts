export type introspection_types = {
  Query: {
    kind: 'OBJECT';
    name: 'Query';
    fields: {
      activeAdministrator: {
        name: 'activeAdministrator';
        type: { kind: 'OBJECT'; name: 'Administrator'; ofType: null };
      };
      activeChannel: {
        name: 'activeChannel';
        type: {
          kind: 'NON_NULL';
          name: never;
          ofType: { kind: 'OBJECT'; name: 'Channel'; ofType: null };
        };
      };
      activedTemplateByRoutePath: {
        name: 'activedTemplateByRoutePath';
        type: { kind: 'OBJECT'; name: 'ModuleTemplate'; ofType: null };
      };
      administrator: {
        name: 'administrator';
        type: { kind: 'OBJECT'; name: 'Administrator'; ofType: null };
      };
      administrators: {
        name: 'administrators';
        type: {
          kind: 'NON_NULL';
          name: never;
          ofType: { kind: 'OBJECT'; name: 'AdministratorList'; ofType: null };
        };
      };
      asset: {
        name: 'asset';
        type: { kind: 'OBJECT'; name: 'Asset'; ofType: null };
      };
      assets: {
        name: 'assets';
        type: {
          kind: 'NON_NULL';
          name: never;
          ofType: { kind: 'OBJECT'; name: 'AssetList'; ofType: null };
        };
      };
      channel: {
        name: 'channel';
        type: { kind: 'OBJECT'; name: 'Channel'; ofType: null };
      };
      channels: {
        name: 'channels';
        type: {
          kind: 'NON_NULL';
          name: never;
          ofType: { kind: 'OBJECT'; name: 'ChannelList'; ofType: null };
        };
      };
      collection: {
        name: 'collection';
        type: { kind: 'OBJECT'; name: 'Collection'; ofType: null };
      };
      collectionFilters: {
        name: 'collectionFilters';
        type: {
          kind: 'NON_NULL';
          name: never;
          ofType: {
            kind: 'LIST';
            name: never;
            ofType: {
              kind: 'NON_NULL';
              name: never;
              ofType: {
                kind: 'OBJECT';
                name: 'ConfigurableOperationDefinition';
                ofType: null;
              };
            };
          };
        };
      };
      collections: {
        name: 'collections';
        type: {
          kind: 'NON_NULL';
          name: never;
          ofType: { kind: 'OBJECT'; name: 'CollectionList'; ofType: null };
        };
      };
      countries: {
        name: 'countries';
        type: {
          kind: 'NON_NULL';
          name: never;
          ofType: { kind: 'OBJECT'; name: 'CountryList'; ofType: null };
        };
      };
      country: {
        name: 'country';
        type: { kind: 'OBJECT'; name: 'Country'; ofType: null };
      };
      customer: {
        name: 'customer';
        type: { kind: 'OBJECT'; name: 'Customer'; ofType: null };
      };
      customerGroup: {
        name: 'customerGroup';
        type: { kind: 'OBJECT'; name: 'CustomerGroup'; ofType: null };
      };
      customerGroups: {
        name: 'customerGroups';
        type: {
          kind: 'NON_NULL';
          name: never;
          ofType: { kind: 'OBJECT'; name: 'CustomerGroupList'; ofType: null };
        };
      };
      customers: {
        name: 'customers';
        type: {
          kind: 'NON_NULL';
          name: never;
          ofType: { kind: 'OBJECT'; name: 'CustomerList'; ofType: null };
        };
      };
      eligibleShippingMethodsForDraftOrder: {
        name: 'eligibleShippingMethodsForDraftOrder';
        type: {
          kind: 'NON_NULL';
          name: never;
          ofType: {
            kind: 'LIST';
            name: never;
            ofType: {
              kind: 'NON_NULL';
              name: never;
              ofType: {
                kind: 'OBJECT';
                name: 'ShippingMethodQuote';
                ofType: null;
              };
            };
          };
        };
      };
      entityDuplicators: {
        name: 'entityDuplicators';
        type: {
          kind: 'NON_NULL';
          name: never;
          ofType: {
            kind: 'LIST';
            name: never;
            ofType: {
              kind: 'NON_NULL';
              name: never;
              ofType: {
                kind: 'OBJECT';
                name: 'EntityDuplicatorDefinition';
                ofType: null;
              };
            };
          };
        };
      };
      facet: {
        name: 'facet';
        type: { kind: 'OBJECT'; name: 'Facet'; ofType: null };
      };
      facetValue: {
        name: 'facetValue';
        type: { kind: 'OBJECT'; name: 'FacetValue'; ofType: null };
      };
      facetValues: {
        name: 'facetValues';
        type: {
          kind: 'NON_NULL';
          name: never;
          ofType: { kind: 'OBJECT'; name: 'FacetValueList'; ofType: null };
        };
      };
      facets: {
        name: 'facets';
        type: {
          kind: 'NON_NULL';
          name: never;
          ofType: { kind: 'OBJECT'; name: 'FacetList'; ofType: null };
        };
      };
      fulfillmentHandlers: {
        name: 'fulfillmentHandlers';
        type: {
          kind: 'NON_NULL';
          name: never;
          ofType: {
            kind: 'LIST';
            name: never;
            ofType: {
              kind: 'NON_NULL';
              name: never;
              ofType: {
                kind: 'OBJECT';
                name: 'ConfigurableOperationDefinition';
                ofType: null;
              };
            };
          };
        };
      };
      getSettingsStoreValue: {
        name: 'getSettingsStoreValue';
        type: { kind: 'SCALAR'; name: 'JSON'; ofType: null };
      };
      getSettingsStoreValues: {
        name: 'getSettingsStoreValues';
        type: { kind: 'SCALAR'; name: 'JSON'; ofType: null };
      };
      globalSettings: {
        name: 'globalSettings';
        type: {
          kind: 'NON_NULL';
          name: never;
          ofType: { kind: 'OBJECT'; name: 'GlobalSettings'; ofType: null };
        };
      };
      job: { name: 'job'; type: { kind: 'OBJECT'; name: 'Job'; ofType: null } };
      jobBufferSize: {
        name: 'jobBufferSize';
        type: {
          kind: 'NON_NULL';
          name: never;
          ofType: {
            kind: 'LIST';
            name: never;
            ofType: {
              kind: 'NON_NULL';
              name: never;
              ofType: { kind: 'OBJECT'; name: 'JobBufferSize'; ofType: null };
            };
          };
        };
      };
      jobQueues: {
        name: 'jobQueues';
        type: {
          kind: 'NON_NULL';
          name: never;
          ofType: {
            kind: 'LIST';
            name: never;
            ofType: {
              kind: 'NON_NULL';
              name: never;
              ofType: { kind: 'OBJECT'; name: 'JobQueue'; ofType: null };
            };
          };
        };
      };
      jobs: {
        name: 'jobs';
        type: {
          kind: 'NON_NULL';
          name: never;
          ofType: { kind: 'OBJECT'; name: 'JobList'; ofType: null };
        };
      };
      jobsById: {
        name: 'jobsById';
        type: {
          kind: 'NON_NULL';
          name: never;
          ofType: {
            kind: 'LIST';
            name: never;
            ofType: {
              kind: 'NON_NULL';
              name: never;
              ofType: { kind: 'OBJECT'; name: 'Job'; ofType: null };
            };
          };
        };
      };
      me: {
        name: 'me';
        type: { kind: 'OBJECT'; name: 'CurrentUser'; ofType: null };
      };
      module: {
        name: 'module';
        type: { kind: 'OBJECT'; name: 'Module'; ofType: null };
      };
      moduleElementAcl: {
        name: 'moduleElementAcl';
        type: { kind: 'OBJECT'; name: 'ModuleElementAcl'; ofType: null };
      };
      moduleElementAcls: {
        name: 'moduleElementAcls';
        type: {
          kind: 'NON_NULL';
          name: never;
          ofType: {
            kind: 'OBJECT';
            name: 'ModuleElementAclList';
            ofType: null;
          };
        };
      };
      moduleMenu: {
        name: 'moduleMenu';
        type: { kind: 'OBJECT'; name: 'ModuleMenu'; ofType: null };
      };
      moduleMenus: {
        name: 'moduleMenus';
        type: {
          kind: 'NON_NULL';
          name: never;
          ofType: { kind: 'OBJECT'; name: 'ModuleMenuList'; ofType: null };
        };
      };
      moduleNormal: {
        name: 'moduleNormal';
        type: { kind: 'OBJECT'; name: 'ModuleNormal'; ofType: null };
      };
      moduleNormals: {
        name: 'moduleNormals';
        type: {
          kind: 'NON_NULL';
          name: never;
          ofType: { kind: 'OBJECT'; name: 'ModuleNormalList'; ofType: null };
        };
      };
      moduleTag: {
        name: 'moduleTag';
        type: { kind: 'OBJECT'; name: 'ModuleTag'; ofType: null };
      };
      moduleTags: {
        name: 'moduleTags';
        type: {
          kind: 'NON_NULL';
          name: never;
          ofType: { kind: 'OBJECT'; name: 'ModuleTagList'; ofType: null };
        };
      };
      moduleTemplate: {
        name: 'moduleTemplate';
        type: { kind: 'OBJECT'; name: 'ModuleTemplate'; ofType: null };
      };
      moduleTemplates: {
        name: 'moduleTemplates';
        type: {
          kind: 'NON_NULL';
          name: never;
          ofType: { kind: 'OBJECT'; name: 'ModuleTemplateList'; ofType: null };
        };
      };
      modules: {
        name: 'modules';
        type: {
          kind: 'NON_NULL';
          name: never;
          ofType: { kind: 'OBJECT'; name: 'ModuleList'; ofType: null };
        };
      };
      order: {
        name: 'order';
        type: { kind: 'OBJECT'; name: 'Order'; ofType: null };
      };
      orders: {
        name: 'orders';
        type: {
          kind: 'NON_NULL';
          name: never;
          ofType: { kind: 'OBJECT'; name: 'OrderList'; ofType: null };
        };
      };
      paymentMethod: {
        name: 'paymentMethod';
        type: { kind: 'OBJECT'; name: 'PaymentMethod'; ofType: null };
      };
      paymentMethodEligibilityCheckers: {
        name: 'paymentMethodEligibilityCheckers';
        type: {
          kind: 'NON_NULL';
          name: never;
          ofType: {
            kind: 'LIST';
            name: never;
            ofType: {
              kind: 'NON_NULL';
              name: never;
              ofType: {
                kind: 'OBJECT';
                name: 'ConfigurableOperationDefinition';
                ofType: null;
              };
            };
          };
        };
      };
      paymentMethodHandlers: {
        name: 'paymentMethodHandlers';
        type: {
          kind: 'NON_NULL';
          name: never;
          ofType: {
            kind: 'LIST';
            name: never;
            ofType: {
              kind: 'NON_NULL';
              name: never;
              ofType: {
                kind: 'OBJECT';
                name: 'ConfigurableOperationDefinition';
                ofType: null;
              };
            };
          };
        };
      };
      paymentMethods: {
        name: 'paymentMethods';
        type: {
          kind: 'NON_NULL';
          name: never;
          ofType: { kind: 'OBJECT'; name: 'PaymentMethodList'; ofType: null };
        };
      };
      pendingSearchIndexUpdates: {
        name: 'pendingSearchIndexUpdates';
        type: {
          kind: 'NON_NULL';
          name: never;
          ofType: { kind: 'SCALAR'; name: 'Int'; ofType: null };
        };
      };
      previewCollectionVariants: {
        name: 'previewCollectionVariants';
        type: {
          kind: 'NON_NULL';
          name: never;
          ofType: { kind: 'OBJECT'; name: 'ProductVariantList'; ofType: null };
        };
      };
      product: {
        name: 'product';
        type: { kind: 'OBJECT'; name: 'Product'; ofType: null };
      };
      productOptionGroup: {
        name: 'productOptionGroup';
        type: { kind: 'OBJECT'; name: 'ProductOptionGroup'; ofType: null };
      };
      productOptionGroups: {
        name: 'productOptionGroups';
        type: {
          kind: 'NON_NULL';
          name: never;
          ofType: {
            kind: 'LIST';
            name: never;
            ofType: {
              kind: 'NON_NULL';
              name: never;
              ofType: {
                kind: 'OBJECT';
                name: 'ProductOptionGroup';
                ofType: null;
              };
            };
          };
        };
      };
      productVariant: {
        name: 'productVariant';
        type: { kind: 'OBJECT'; name: 'ProductVariant'; ofType: null };
      };
      productVariants: {
        name: 'productVariants';
        type: {
          kind: 'NON_NULL';
          name: never;
          ofType: { kind: 'OBJECT'; name: 'ProductVariantList'; ofType: null };
        };
      };
      products: {
        name: 'products';
        type: {
          kind: 'NON_NULL';
          name: never;
          ofType: { kind: 'OBJECT'; name: 'ProductList'; ofType: null };
        };
      };
      promotion: {
        name: 'promotion';
        type: { kind: 'OBJECT'; name: 'Promotion'; ofType: null };
      };
      promotionActions: {
        name: 'promotionActions';
        type: {
          kind: 'NON_NULL';
          name: never;
          ofType: {
            kind: 'LIST';
            name: never;
            ofType: {
              kind: 'NON_NULL';
              name: never;
              ofType: {
                kind: 'OBJECT';
                name: 'ConfigurableOperationDefinition';
                ofType: null;
              };
            };
          };
        };
      };
      promotionConditions: {
        name: 'promotionConditions';
        type: {
          kind: 'NON_NULL';
          name: never;
          ofType: {
            kind: 'LIST';
            name: never;
            ofType: {
              kind: 'NON_NULL';
              name: never;
              ofType: {
                kind: 'OBJECT';
                name: 'ConfigurableOperationDefinition';
                ofType: null;
              };
            };
          };
        };
      };
      promotions: {
        name: 'promotions';
        type: {
          kind: 'NON_NULL';
          name: never;
          ofType: { kind: 'OBJECT'; name: 'PromotionList'; ofType: null };
        };
      };
      province: {
        name: 'province';
        type: { kind: 'OBJECT'; name: 'Province'; ofType: null };
      };
      provinces: {
        name: 'provinces';
        type: {
          kind: 'NON_NULL';
          name: never;
          ofType: { kind: 'OBJECT'; name: 'ProvinceList'; ofType: null };
        };
      };
      role: {
        name: 'role';
        type: { kind: 'OBJECT'; name: 'Role'; ofType: null };
      };
      roles: {
        name: 'roles';
        type: {
          kind: 'NON_NULL';
          name: never;
          ofType: { kind: 'OBJECT'; name: 'RoleList'; ofType: null };
        };
      };
      scheduledTasks: {
        name: 'scheduledTasks';
        type: {
          kind: 'NON_NULL';
          name: never;
          ofType: {
            kind: 'LIST';
            name: never;
            ofType: {
              kind: 'NON_NULL';
              name: never;
              ofType: { kind: 'OBJECT'; name: 'ScheduledTask'; ofType: null };
            };
          };
        };
      };
      search: {
        name: 'search';
        type: {
          kind: 'NON_NULL';
          name: never;
          ofType: { kind: 'OBJECT'; name: 'SearchResponse'; ofType: null };
        };
      };
      seller: {
        name: 'seller';
        type: { kind: 'OBJECT'; name: 'Seller'; ofType: null };
      };
      sellers: {
        name: 'sellers';
        type: {
          kind: 'NON_NULL';
          name: never;
          ofType: { kind: 'OBJECT'; name: 'SellerList'; ofType: null };
        };
      };
      shippingCalculators: {
        name: 'shippingCalculators';
        type: {
          kind: 'NON_NULL';
          name: never;
          ofType: {
            kind: 'LIST';
            name: never;
            ofType: {
              kind: 'NON_NULL';
              name: never;
              ofType: {
                kind: 'OBJECT';
                name: 'ConfigurableOperationDefinition';
                ofType: null;
              };
            };
          };
        };
      };
      shippingEligibilityCheckers: {
        name: 'shippingEligibilityCheckers';
        type: {
          kind: 'NON_NULL';
          name: never;
          ofType: {
            kind: 'LIST';
            name: never;
            ofType: {
              kind: 'NON_NULL';
              name: never;
              ofType: {
                kind: 'OBJECT';
                name: 'ConfigurableOperationDefinition';
                ofType: null;
              };
            };
          };
        };
      };
      shippingMethod: {
        name: 'shippingMethod';
        type: { kind: 'OBJECT'; name: 'ShippingMethod'; ofType: null };
      };
      shippingMethods: {
        name: 'shippingMethods';
        type: {
          kind: 'NON_NULL';
          name: never;
          ofType: { kind: 'OBJECT'; name: 'ShippingMethodList'; ofType: null };
        };
      };
      stockLocation: {
        name: 'stockLocation';
        type: { kind: 'OBJECT'; name: 'StockLocation'; ofType: null };
      };
      stockLocations: {
        name: 'stockLocations';
        type: {
          kind: 'NON_NULL';
          name: never;
          ofType: { kind: 'OBJECT'; name: 'StockLocationList'; ofType: null };
        };
      };
      tag: {
        name: 'tag';
        type: {
          kind: 'NON_NULL';
          name: never;
          ofType: { kind: 'OBJECT'; name: 'Tag'; ofType: null };
        };
      };
      tags: {
        name: 'tags';
        type: {
          kind: 'NON_NULL';
          name: never;
          ofType: { kind: 'OBJECT'; name: 'TagList'; ofType: null };
        };
      };
      taxCategories: {
        name: 'taxCategories';
        type: {
          kind: 'NON_NULL';
          name: never;
          ofType: { kind: 'OBJECT'; name: 'TaxCategoryList'; ofType: null };
        };
      };
      taxCategory: {
        name: 'taxCategory';
        type: { kind: 'OBJECT'; name: 'TaxCategory'; ofType: null };
      };
      taxRate: {
        name: 'taxRate';
        type: { kind: 'OBJECT'; name: 'TaxRate'; ofType: null };
      };
      taxRates: {
        name: 'taxRates';
        type: {
          kind: 'NON_NULL';
          name: never;
          ofType: { kind: 'OBJECT'; name: 'TaxRateList'; ofType: null };
        };
      };
      testEligibleShippingMethods: {
        name: 'testEligibleShippingMethods';
        type: {
          kind: 'NON_NULL';
          name: never;
          ofType: {
            kind: 'LIST';
            name: never;
            ofType: {
              kind: 'NON_NULL';
              name: never;
              ofType: {
                kind: 'OBJECT';
                name: 'ShippingMethodQuote';
                ofType: null;
              };
            };
          };
        };
      };
      testShippingMethod: {
        name: 'testShippingMethod';
        type: {
          kind: 'NON_NULL';
          name: never;
          ofType: {
            kind: 'OBJECT';
            name: 'TestShippingMethodResult';
            ofType: null;
          };
        };
      };
      zone: {
        name: 'zone';
        type: { kind: 'OBJECT'; name: 'Zone'; ofType: null };
      };
      zones: {
        name: 'zones';
        type: {
          kind: 'NON_NULL';
          name: never;
          ofType: { kind: 'OBJECT'; name: 'ZoneList'; ofType: null };
        };
      };
    };
  };
  Refund: {
    kind: 'OBJECT';
    name: 'Refund';
    fields: {
      adjustment: {
        name: 'adjustment';
        type: {
          kind: 'NON_NULL';
          name: never;
          ofType: { kind: 'SCALAR'; name: 'Money'; ofType: null };
        };
      };
      createdAt: {
        name: 'createdAt';
        type: {
          kind: 'NON_NULL';
          name: never;
          ofType: { kind: 'SCALAR'; name: 'DateTime'; ofType: null };
        };
      };
      customFields: {
        name: 'customFields';
        type: { kind: 'SCALAR'; name: 'JSON'; ofType: null };
      };
      id: {
        name: 'id';
        type: {
          kind: 'NON_NULL';
          name: never;
          ofType: { kind: 'SCALAR'; name: 'ID'; ofType: null };
        };
      };
      items: {
        name: 'items';
        type: {
          kind: 'NON_NULL';
          name: never;
          ofType: { kind: 'SCALAR'; name: 'Money'; ofType: null };
        };
      };
      lines: {
        name: 'lines';
        type: {
          kind: 'NON_NULL';
          name: never;
          ofType: {
            kind: 'LIST';
            name: never;
            ofType: {
              kind: 'NON_NULL';
              name: never;
              ofType: { kind: 'OBJECT'; name: 'RefundLine'; ofType: null };
            };
          };
        };
      };
      metadata: {
        name: 'metadata';
        type: { kind: 'SCALAR'; name: 'JSON'; ofType: null };
      };
      method: {
        name: 'method';
        type: { kind: 'SCALAR'; name: 'String'; ofType: null };
      };
      paymentId: {
        name: 'paymentId';
        type: {
          kind: 'NON_NULL';
          name: never;
          ofType: { kind: 'SCALAR'; name: 'ID'; ofType: null };
        };
      };
      reason: {
        name: 'reason';
        type: { kind: 'SCALAR'; name: 'String'; ofType: null };
      };
      shipping: {
        name: 'shipping';
        type: {
          kind: 'NON_NULL';
          name: never;
          ofType: { kind: 'SCALAR'; name: 'Money'; ofType: null };
        };
      };
      state: {
        name: 'state';
        type: {
          kind: 'NON_NULL';
          name: never;
          ofType: { kind: 'SCALAR'; name: 'String'; ofType: null };
        };
      };
      total: {
        name: 'total';
        type: {
          kind: 'NON_NULL';
          name: never;
          ofType: { kind: 'SCALAR'; name: 'Money'; ofType: null };
        };
      };
      transactionId: {
        name: 'transactionId';
        type: { kind: 'SCALAR'; name: 'String'; ofType: null };
      };
      updatedAt: {
        name: 'updatedAt';
        type: {
          kind: 'NON_NULL';
          name: never;
          ofType: { kind: 'SCALAR'; name: 'DateTime'; ofType: null };
        };
      };
    };
  };
};

/** An IntrospectionQuery representation of your schema.
 *
 * @remarks
 * This is an introspection of your schema saved as a file by GraphQLSP.
 * It will automatically be used by `gql.tada` to infer the types of your GraphQL documents.
 * If you need to reuse this data or update your `scalars`, update `tadaOutputLocation` to
 * instead save to a .ts instead of a .d.ts file.
 */
export type introspection = {
  name: 'admin-api';
  query: 'Query';
  mutation: 'Mutation';
  subscription: never;
  types: introspection_types;
};
