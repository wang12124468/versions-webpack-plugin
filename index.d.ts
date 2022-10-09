import { Plugin } from 'webpack';

export = VersionsWebpackPlugin;

declare class VersionsWebpackPlugin extends Plugin {
    constructor(options: VersionsWebpackPlugin.Options);
}

declare namespace VersionsWebpackPlugin {
    interface Basic {
        date?: boolean;
        filelist?: boolean;
    }
    
    interface Git {
        commit?: boolean;
        author?: boolean;
        date?: boolean;
    }
    
    interface Info {
        key: string;
        value: string | string[];
    }
    
    interface Version {
        title: string;
        infos: Info[];
    }
    
    interface Callback {
        (versions: Version[]): Version[]|void;
    }
    
    interface Options {
        filename?: string;
        basic?: Basic;
        git?: Git;
        callback?: Callback;
    }
}
