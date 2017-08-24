<!-- Basic datatable -->
<div class="panel panel-flat">

    <table id="tbl_data" class="table datatable-basic">
        <thead>
            <tr>
                <th width="20%"><?php echo __('Code', array(), 'Code');?></th>
                <th width="30%"><?php echo __('Name', array(), 'Name');?></th>
                <th width="10%"><?php echo __('Status', array(), 'Status');?></th>
                <th width="10%" class="text-center"></th>
            </tr>
        </thead>
    </table>
</div>
<!-- /basic datatable -->


<?php
    $linkLoadData = Uri::create('system/language/load_item_data');
    $linkDelete = Uri::create('system/language/status_item?type_action=delete');
    $linkStatus = Uri::create('system/language/status_item?type_action=status');                                                         
?>
<script>
$(function(){
    var table = $('#tbl_data').DataTable({
        bServerSide   : true,
        sAjaxSource   : '<?php echo @$linkLoadData?>',
        columns:[
            {'data' : 'code'},
            {'data' : 'name'},
            {'data' : 'status'},
            {'data' : 'control', 'bSortable' : false, 'class' : 'text-center'}
        ],
        aaSorting: [[ 0, "asc" ]],
        fnDrawCallback: function ( oSettings ) {
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
     * Generate file translate
     *============================================*/
    $('#btn-generate-file').on('click', function(){
        $.get('<?php echo \Uri::create("/system/language/generate_translate");?>', function(data){
            switch(data.status) {
                case 'error':
                    toastr.error(data.msg);   
                    break;
                case 'success':
                    toastr.success(data.msg);   
                    break;
            }
        }, 'json')
        return false;
    })
})
</script>