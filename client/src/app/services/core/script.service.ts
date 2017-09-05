interface Scripts {
   name: string;
   src: string;
}
export const ScriptStore: Scripts[] = [
   {name: 'filepicker', src: '../assets/plugins/sweetalert2/sweetalert2.js'},
   {name: 'custom', src: '../../assets/public/js/custom/custom.js'},
   // {name: 'core_utils', src: '../../assets/public/js/custom/core.utils.js'},
   {name: 'core_init', src: '../../assets/public/js/custom/core.init.js'},
   {name: 'theme_shortcodes', src: '../../assets/public/js/custom/theme.shortcodes.js'},
   {name: 'grid_layout', src: '../../assets/public/js/vendor/grid.layout/grid.layout.min.js'},
   {name: 'widget', src: '../../assets/public/js/vendor/jquery/widget.min.js'},
   {name: 'accordion', src: '../../assets/public/js/vendor/jquery/accordion.min.js'},
   {name: 'core_googlemap', src: '../../assets/public/js/vendor/core.googlemap.js'},

   // {name: 'theme_init', src: '../../assets/public/js/custom/theme.init.js'},
   // {name: 'theme_shortcodes', src: '../../assets/public/js/custom/theme.shortcodes.js'}
];

export class ScriptService {

    private scripts: any = {};

    constructor() {
        ScriptStore.forEach((script: any) => {
            this.scripts[script.name] = {
                loaded: false,
                src: script.src
            };
        });
    }

    load(...scripts: string[]) {
        var promises: any[] = [];
        scripts.forEach((script) => promises.push(this.loadScript(script)));
        return Promise.all(promises);
    }

    loadScript(name: string) {
        return new Promise((resolve, reject) => {
            //resolve if already loaded
            if (this.scripts[name].loaded) {
                resolve({script: name, loaded: true, status: 'Already Loaded'});
            }
            else {
                //load script
                let script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = this.scripts[name].src;
                script.onload = () => {
                    this.scripts[name].loaded = true;
                    resolve({script: name, loaded: true, status: 'Loaded'});
                };
                script.onerror = (error: any) => resolve({script: name, loaded: false, status: 'Loaded'});
                document.getElementById('load_js').appendChild(script);
            }
        });
    }

}
