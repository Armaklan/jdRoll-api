export default function(sessionProvider: any) {
    return function(req: any, res: any, next: any) {
        if(req.cookies && req.cookies.PHPSESSID) {
            sessionProvider.get(req.cookies.PHPSESSID).then((data: any) => {
                req.phpSession = data;
                next();
            }).catch(() => {
                next();
            });
        } else {
            next();
        }
    };
};
