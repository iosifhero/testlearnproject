import type { AuthApiData, GetUserData } from "~/utils/types/authTypes";
import type {
  IEntity,
  IEntityIdAndName,
  IKuList,
  IKuPost,
  IKuId,
  IGraphic,
  GetAllInvoices,
  GetAllInvoicesReturnData,
  GetAllProducts,
  GetAllProductsReturnData,
  GetAllVendors,
  GetAllVendorsReturnData,
  GetAllVendorsForEntity,
  GetAllVendorsForEntityReturnData,
  GetAllBrandsReturnData,
  GetAllBrands,
  GetAllProducer,
  GetAllProducersReturnData,
  GetAllVendorsForEntityInVendor,
  GetAllVendorsForEntityInVendorReturnData,
  EntityId,
  GetAllEntities,
} from "~/utils/types/directoryTypes";
const isBearer = true;

// export const AUTH = {
//   getToken: (
//     data: AuthApiData
//   ): Promise<{ access: string; refresh: string } | null> =>
//     $Authorization({ data, isBearer: false }),
//   getUserData: (data: GetUserData): Promise<GetUserData> =>
//     $Post("api/me", { data, isBearer }),
// };
export const AUTH = {
  getToken: (data: {
    username: string;
    password: string;
  }): Promise<{ access: string; refresh: string } | null> =>
    $Authorization({ data, isBearer: false }),
  getUserData: (data: GetUserData): Promise<GetUserData> =>
    $Post("api/me", { data, isBearer }),
};

export const INVOICE = {
  getInvoicesList: (
    params?: GetAllInvoices
  ): Promise<GetAllInvoicesReturnData> =>
    $Get("api/venddoclist", { params, isBearer: false }),
};
export const ENTITY = {
  getEntitiesList: (params: GetAllEntities): Promise<IEntity> =>
    $Get("api/entitieslist/", { params, isBearer: false }),
  getEntityById: (data: IEntityIdAndName): Promise<IEntityIdAndName[]> =>
    $Get("api/entitieslist/", { data, isBearer: false }),
};

export const VENDOR = {
  getVendorsList: (params?: GetAllVendors): Promise<GetAllVendorsReturnData> =>
    $Get("api/vendorlist/", { params, isBearer: false }),
  getVendorsForEntity: (
    params?: GetAllVendorsForEntity
  ): Promise<GetAllVendorsForEntityReturnData> =>
    $Get("api/vendorfilter/", { params, isBearer: false }),

  getVendorsForEntityInVendor: (
    params?: GetAllVendorsForEntityInVendor
  ): Promise<GetAllVendorsForEntityInVendorReturnData> =>
    $Get("api/vendorlist/", { params, isBearer: false }),
  getEntityById: (): Promise<EntityId[]> =>
    $Get("api/entitieslist/", { isBearer: false }),
  // getEntityById: (): Promise<IEntityIdAndName[]> =>
  // $Get("api/entitieslist/", { isBearer: false }),
};

export const PRODUCT = {
  getProductsList: (
    params?: GetAllProducts
  ): Promise<GetAllProductsReturnData> =>
    $Get("api/productslist", { params, isBearer: false }),
};

export const KU = {
  getKuList: (data: IKuList): Promise<IKuList> =>
    $Get("api/kulist", { data, isBearer: false }),
  postKu: (data: IKuPost): Promise<IKuPost> =>
    $Post("api/kulist", { data, isBearer: false }),
  deleteKu: (data: IKuId) =>
    $Delete(`api/kudetail/${data.ku_id}`, { data, isBearer: false }),
};

export const GRAPHIC = {
  getGraphic: (data: IGraphic): Promise<IGraphic> =>
    $Get("api/kugraph", { data, isBearer: false }),
  postGraphic: (data: IGraphic): Promise<IGraphic> =>
    $Post("api/kugraph", { data, isBearer: false }),
};

export const PRODUCER = {
  getProducer: (params?: GetAllProducer): Promise<GetAllProducersReturnData> =>
    $Get("api/brandlist", { params, isBearer: false }),
};

export const BRAND = {
  getBrand: (params?: GetAllBrands): Promise<GetAllBrandsReturnData> =>
    $Get("api/brandlist", { params, isBearer: false }),
};
