import fs = require('fs');
import path = require('path');
import http = require('http');
import ssl = require('ssl');

ssl.loadRootCerts();

import semver = require('semver');

const PKGJSON_FILE = path.resolve(__dirname, '../../package.json');

export function parsePkgInfo (filepath = PKGJSON_FILE): Record<string, string | boolean | number | object> & {
    name: string
    version: string
} {
    return JSON.parse(fs.readFile(filepath).toString());
}

const PKGJSON = parsePkgInfo();

export function getPackgageNpmInfo({
    registry = 'https://registry.npmjs.org',
    pkgName = PKGJSON.name
}: {
    registry?: string,
    pkgName?: string
} = {}) {
    const pkgInfo = parsePkgInfo();

    return http.get(`${registry}/${pkgName}`, {
    })
}

export function checkUpgrade ({
    pkgCurrentVersion
}: {
    pkgCurrentVersion: string
}) {
    const response = getPackgageNpmInfo();

    if (response.statusCode !== 200) {
        return {
            errCode: 1,
            message: `statusCode(${response.statusCode}) error: ${response.statusMessage}`,
            response
        }
    }
    const npmRepoInfo = response.json();

    let latestVersion: string;

    latestVersion = npmRepoInfo['dist-tags'].latest;

    if (!latestVersion && npmRepoInfo['time']) {
        latestVersion = Object.entries(npmRepoInfo['time'] as Record<string, string>)
            .filter(([k]) => ['created', 'modified'].includes(k))
            .sort(([, d1], [, d2]) => {
                return (new Date(d1)).getTime() - (new Date(d2)).getTime();
            })?.[0]?.[0];
    }
    if (!latestVersion && npmRepoInfo['versions']) {
        latestVersion = Object.keys(npmRepoInfo['versions'] as Record<string, object>)
            .sort((v1, v2) => {
                return semver.gt(v1, v2) ? 1 : -1;
            })?.[0]
    }

    return {
        errCode: 0,
        message: 'ok',
        result: {
            latestVersion,
            currentVersion: pkgCurrentVersion,
            needUpgrade: !semver.gte(pkgCurrentVersion, latestVersion)
        }
    }
}
