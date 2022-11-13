function getAvailRoutes(routes, perms) {
    if(routes && routes.length) {
        return routes.filter(item => {
            const avail = perms.indexOf(item.path) > -1;
            if(avail && item.children && item.children.length) {
                item.children = getAvailRoutes(item.children,perms);
            }
            return avail;
        })
    }
    return [];
}

export {
    getAvailRoutes
}