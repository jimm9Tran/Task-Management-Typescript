interface objectSearch {
    keyword: string,
    regex?: RegExp,
}

const serachHelper = (query: Record<string, any>) => {
    let objectSearch: objectSearch = {
        keyword: "",
    }

    if (query.keyword){
        objectSearch.keyword = query.keyword;

        const regex = new RegExp(objectSearch.keyword, "i");

        objectSearch.regex = regex;
    }

    return objectSearch;
}

export default serachHelper;