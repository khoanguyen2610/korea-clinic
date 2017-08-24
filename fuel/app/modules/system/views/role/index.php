<!-- Basic datatable -->
<div class="panel panel-flat">

    <table id="tbl_data" class="table datatable-basic">
        <thead>
            <tr>
                <th width="20%"><?php echo __('Name', array(), 'Name');?></th>
                <th width="30%"><?php echo __('Description', array(), 'Description');?></th>
                <th width="30%"><?php echo __('Content', array(), 'Content');?></th>
                <th width="10%"><?php echo __('Status', array(), 'Status');?></th>
                <th width="10%" class="text-center"></th>
            </tr>
        </thead>
    </table>
</div>
<!-- /basic datatable -->


<?php
    $linkLoadData = Uri::create('system/role/load_item_data');
    $linkDelete = Uri::create('system/role/status_item?type_action=delete');
    $linkStatus = Uri::create('system/role/status_item?type_action=status');                                                         
?>
<script>
$(function(){
    var table = $('#tbl_data').DataTable({
        bServerSide   : true,
        sAjaxSource   : '<?php echo @$linkLoadData?>',
        columns:[
            {'data' : 'name'},
            {'data' : 'description'},
            {'data' : 'content'},
            {'data' : 'status'},
            {'data' : 'control', 'bSortable' : false, 'class' : 'text-center'}
        ],
        aaSorting : [[ 0, "asc" ]],
        fnDrawCallback : function ( oSettings ) {
            $('.dataTables_length select').select2({
                minimumResultsForSearch: Infinity,
                width: 'auto'
            });
        }
    });

    $('#tbl_data').on('click', '#tbl-delete-btn', function () {
        singleDelete($(this), '<?php echo $linkDelete?>', table);
        return false;
    }); 
    
    $('#tbl_data').on('click', '#tbl-status-btn', function () {
        singleStatus($(this), '<?php echo $linkStatus?>', table);
        return false;
    });
    
    /*============================================
     * Update List MCA
     *============================================*/
    $('#btn_update_area').on('click', function(){
        $.get('<?php echo \Uri::create("/system/script/update_mca");?>', function(data){
            switch(data.status) {
                case 'error':
                    toastr.error(data.msg);   
                    break;
                case 'success':
                    toastr.success(data.msg);   
                    break;
            }
        }, 'json')
    })
    
})
</script>