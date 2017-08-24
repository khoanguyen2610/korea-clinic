<?php
use Fuel\Core\Form;
?>
<!-- Basic datatable -->
<div class="panel panel-flat">

    <table id="tbl_data" class="table datatable-basic">
        <thead>
            <tr>
                <th width="15%"><?php echo __('Full Name', array(), 'Full Name');?></th>
                <th width="12%"><?php echo __('User Name', array(), 'User Name');?></th>
                <th width="15%"><?php echo __('Email', array(), 'Email');?></th>
                <th width="25%"><?php echo __('Organization', array(), 'Organization');?></th>
                <th width="25%"><?php echo __('Group', array(), 'Group');?></th>
                <th width="25%"><?php echo __('Role', array(), 'Role');?></th>
                <th width="10%"><?php echo __('Status', array(), 'Status');?></th>
                <th width="10%" class="text-center"></th>
            </tr>
        </thead>
        
    </table>
</div>
<!-- /basic datatable -->

<?php
    $linkLoadData = Uri::create('system/user/load_item_data');
    $linkDelete = Uri::create('system/user/status_item?type_action=delete');
    $linkStatus = Uri::create('system/user/status_item?type_action=status');                                                         
?>
<script>
$(function(){
    var table = $('#tbl_data').DataTable({
        bServerSide   : true,
        sAjaxSource   : '<?php echo @$linkLoadData?>',
        columns:[
            {'data' : 'fullname'},
            {'data' : 'username'},
            {'data' : 'email'},
            {'data' : 'organization', 'bSortable' : false},
            {'data' : 'group', 'bSortable' : false},
            {'data' : 'role', 'bSortable' : false},
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