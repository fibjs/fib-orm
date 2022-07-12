/// <reference types="@fibjs/types" />
export declare function parsePkgInfo(filepath?: string): Record<string, string | boolean | number | object> & {
    name: string;
    version: string;
};
export declare function getPackgageNpmInfo({ registry, pkgName }?: {
    registry?: string;
    pkgName?: string;
}): Class_HttpResponse;
export declare function checkUpgrade({ pkgCurrentVersion }: {
    pkgCurrentVersion: string;
}): {
    errCode: number;
    message: string;
    response: Class_HttpResponse;
    result?: undefined;
} | {
    errCode: number;
    message: string;
    result: {
        latestVersion: string;
        currentVersion: string;
        needUpgrade: boolean;
    };
    response?: undefined;
};
