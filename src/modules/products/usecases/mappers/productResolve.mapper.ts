import { ProductDomain } from '../../domain/product.interface';

export interface ProductResolveResult {
  [productId: string]: ProductDomain[];
}

export class ProductResolveMapper {
  /**
   * Agrupa produtos por productId, retornando um Map onde cada chave é um productId
   * e o valor é um array de todos os produtos com esse productId
   * 
   * Antes: retornava array com produtos repetidos para cada pacote principal
   * Agora: retorna Map agrupado por productId
   */
  public static resolveProducts(products: ProductDomain[]): ProductResolveResult {
    const groupedProducts: ProductResolveResult = {};
    
    products.forEach(product => {
      if (!groupedProducts[product.id]) {
        groupedProducts[product.id] = [];
      }
      groupedProducts[product.id].push(product);
    });
    
    return groupedProducts;
  }

  /**
   * Converte o Map para um array plano (método de compatibilidade)
   */
  public static flattenProductResolve(result: ProductResolveResult): ProductDomain[] {
    const flattenedProducts: ProductDomain[] = [];
    
    Object.values(result).forEach(products => {
      flattenedProducts.push(...products);
    });
    
    return flattenedProducts;
  }
}
