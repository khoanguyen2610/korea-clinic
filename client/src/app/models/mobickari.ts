/*
* @Author: th_le
* @Date:   2016-12-05 14:17:32
* @Last Modified by:   th_le
* @Last Modified time: 2016-12-05 14:24:17
*/

export class MObicKari{
    constructor(
        public id: number = null,
        public expense_type_code: number = null,
        public karikata_name: string = null,
        public karikata_sokanjokamoku_cd: string = null,
        public karikata_hojokamoku_cd: string= null,
        public karikata_hojouchiwakekamoku_cd: string = null,
        public karikata_torihikisaki_cd: string = null,
        public karikata_zei_kubun: string = null,
        public karikata_zeikomi_kubun : string = null,
        public karikata_bunseki_cd1: string = null,
        public memo: string = null
    ){}
}