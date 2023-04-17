import axios from 'axios';
import { isArray, isObject } from 'util';

axios.defaults.baseURL = process.env.REACT_APP_ALEPH_URI;

/**
 * Transforms a map of parameters to a ? and & separated URI encoded query string
 * @param {*} queryParams Map of parameters and values which needs to be transformed
 */
export const encodeQueryParams = (queryParams: any) => {
    if (!queryParams) {
        return '';
    }

    const paramList = Object.keys(queryParams).reduce((acc, name) => {
        const value = queryParams[name];
        const encodedName = encodeURIComponent(name);

        if (isArray(value)) {
            return [
                ...acc,
                ...value.map(
                    (item) => `${encodedName}=${encodeURIComponent(item)}`
                ),
            ];
        }

        return [...acc, `${encodedName}=${encodeURIComponent(value)}`];
    }, []);

    return paramList.length ? `?${paramList.join('&')}` : '';
};

/**
 * Replaces parameters with values in an URL with URI encoding
 * @param {*} url The URL which containes variables in curly brace
 * @param {*} params Map of parameters and values which needs to be replaced
 */
export const replaceUrlParams = (url: any, params: any) =>
    Object.keys(params || {}).reduce((acc, key) => {
        const regexp = new RegExp(`\\{${key}\\}`, 'g');
        return acc.replace(regexp, encodeURIComponent(params[key]));
    }, url);

export const processParam = (
    result: any,
    paramTypes: any,
    paramName: any,
    param: any
) => {
    const {
        headerParams = {},
        urlParams = {},
        queryParams = {},
        data = {},
    } = result;
    const paramType = paramTypes[paramName] || 'url';

    let newData = data;

    if (paramType === 'data') {
        // inject the content of param into data
        newData = { ...data, ...param };
    } else if (paramType === 'body') {
        newData = { ...data, [paramName]: param };
    } else if (
        paramType === 'url' ||
        paramType === 'query' ||
        paramType === 'header'
    ) {
        newData = isObject(param) ? param : { [paramName]: param };
    }
    return {
        headerParams:
            paramType === 'header'
                ? { ...headerParams, ...newData }
                : headerParams,
        urlParams:
            paramType === 'url' ? { ...urlParams, ...newData } : urlParams,
        queryParams:
            paramType === 'query'
                ? { ...queryParams, ...newData }
                : queryParams,
        data:
            paramType !== 'url' &&
            paramType !== 'query' &&
            paramType !== 'header'
                ? newData
                : data,
    };
};

/**
 * Here you can build the authorization token if you want...
 */
const auth = () => {
    const email = localStorage.getItem('username');
    return {
        email,
        username: email,
        password: localStorage.getItem('password'),
    };
};

const createService = (config: any) => async (data: any) => {
    const method = (config.method || 'get').toLowerCase();
    const { authRequired } = config;

    return axios({
        ...{
            ...config,
            ...{
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            },
        },
        method,
        url: config.url,
        data: {
            ...data,
            ...(authRequired ? auth() : {}),
        },
    });
};

export default (servicesCfg: any, baseCfg: any) => {
    const services = Object.keys(servicesCfg).reduce((result, name) => {
        return {
            ...result,
            [name]: createService({ ...servicesCfg[name] }),
        };
    }, {});
    return services;
};
