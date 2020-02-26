var _ = require('lodash');
import { items } from "./static-data";

const categoryList = _.reduce(items, (result, item) => {
    const { itemCategory, itemCategoryImageURL, itemCategoryDescription } = item;
    return result.concat({
        itemCategory,
        itemCategoryImageURL,
        itemCategoryDescription
    });
}, []);

const shallowUniqueCatList = _.uniqWith(categoryList, _.isEqual);
const uniqueCategoryList = _.uniqBy(shallowUniqueCatList, 'itemCategory');

const generateCategoryObj = (id, data) => {
    return {
        ...data,
        id
    };
};

const categoryObjList = Array.from(uniqueCategoryList, (v, i) => generateCategoryObj(i+1, v));

let customizationInfo = items[0].customization;

customizationInfo = Array.from(customizationInfo, (v, i) => {
        const { itemName, itemDescription } = v;
        return {
            id: i+1,
            itemName,
            itemDescription
        };
    }
)

let products = Array.from(items, (value, index) => {
    const { itemId, itemName, itemDescription } = value;
    return {
        id: itemId,
        itemName,
        itemDescription
    };
});

products = _.uniqBy(products, "itemName");

let categoryIndexMap = {};
let productIndexMap = {};
let customizationIndexMap = {};

const findMathcingCustomization = name => {
    if(_.has(customizationIndexMap, name)) {
        return customizationIndexMap[name];
    }
    let cId = undefined;
    _.each(customizationInfo, c => {
        if(c.itemName === name){
            customizationIndexMap[name] = c.id;
            cId = c.id;
            return false;
        }
    });
    return cId;
}

const findMatchingCategory = name => {
    if ( _.has(categoryIndexMap, name) ){
        return categoryIndexMap[name];
    }
    let categoryId = undefined;
    _.each(categoryObjList, category => {
        if(category.itemCategory === name) {
            categoryIndexMap[name] = category.id;
            categoryId = category.id;
            return false;
        }
    });
    return categoryId;
};

const findMatchingProduct = (name, description) => {
    let key = name;
    if(_.has(productIndexMap, key)){
        return productIndexMap[key];
    }

    let productId = undefined;
    _.each(products, product => {
        if(product.itemName === name){
            productIndexMap[key] = product.id;
            productId = product.id;
            return false;
        }
    });
    return productId;
};

let relations = {};

_.each(items, item => {
    let categoryId = findMatchingCategory(item.itemCategory);
    if(!categoryId) {
        console.log(categoryId);
        return;
    }
    let productId = findMatchingProduct(item.itemName, item.itemDescription);
    console.log(productId + '=>' + item.itemName +'_'+ item.itemDescription);
    let customizations = [];

    _.each(item.customization, c => {
        let cId = findMathcingCustomization(c.itemName);
        customizations.push( {
            id: cId,
            itemPrice: c.itemPrice
        });
    });

    let itemsArray = relations[categoryId];
    if (!itemsArray){
        itemsArray = [];
        relations[categoryId] = itemsArray;
    }
    if(productId) {
        itemsArray.push({
            id: productId,
            itemPrice: item.itemPrice,
            customizations: customizations
        });
    }
});

let gygSchema = {};

gygSchema["products"] = _.mapKeys(products, "id");
gygSchema["categories"] = _.mapKeys(categoryObjList, "id");
gygSchema["customization"] = _.mapKeys(customizationInfo, "id");
gygSchema["relations"] = relations;

//console.log(productIndexMap);
//console.log(productIndexMap['Slow Roasted Pork (Spicy)'.trim()]);

console.log(JSON.stringify(gygSchema));


