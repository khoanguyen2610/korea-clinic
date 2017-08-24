/*
* @Author: th_le
* @Date:   2016-12-07 08:59:24
* @Last Modified by:   th_le
* @Last Modified time: 2016-12-07 15:20:49
*/

export class MTripPerdiemAllowance {
    constructor(
        public id: number = null,
        public m_trip_area_id: number = null,
        public m_position_id: number = null,
        public perdiem: number = null,
        public allowance: number = null
    ){}
}