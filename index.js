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

let items = 

let gygSchema = {};

gygSchema["categories"] = _.mapKeys(categoryObjList, "id");
gygSchema["customization"] = _.mapKeys(customizationInfo, "id");



console.log(gygSchema);


