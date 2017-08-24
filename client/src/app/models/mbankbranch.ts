/*
* @Author: th_le
* @Date:   2016-12-01 16:13:22
* @Last Modified by:   th_le
* @Last Modified time: 2016-12-02 14:33:00
*/

export class MBankBranch {
  constructor(
    public id: number = null,
    public m_bank_id: string = null,
    public code: string = null,
    public name: string = null,
    public name_kana: string = null,
    public name_e: string = null
  ){}
}