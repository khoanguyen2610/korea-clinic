<!-- Basic datatable -->
<div class="panel panel-flat">
    <table id="tbl_data" class="table datatable-basic">
        <thead>
            <tr>
                <th width="20%"><?php echo __('Name', array(), 'Name');?></th>
                <th width="20%"><?php echo __('Description', array(), 'Description');?></th>
                <th width="30%"><?php echo __('Role', array(), 'Role');?></th>
                <th width="10%"><?php echo __('Member', array(), 'Member');?></th>
                <th width="10%"><?php echo __('Status', array(), 'Status');?></th>
                <th width="10%" class="text-center"></th>
            </tr>
        </thead>
    </table>
</div>
<!-- /basic datatable -->

<?php
    $linkLoadData = Uri::create('system/group/load_item_data');
    $linkDelete = Uri::create('system/group/status_item?type_action=delete');
    $linkStatus = Uri::create('system/group/status_item?type_action=status');                                                         
?>
<script>
$(function(){
    var table = $('#tbl_data').DataTable({
        bServerSide   : true,
        sAjaxSource   : '<?php echo @$linkLoadData?>',
        columns:[
            {'data' : 'name'},
            {'data' : 'description'},
            {'data' : 'role', 'bSortable' : false},
            {'data' : 'member'},
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
})
</script>