<!-- Basic datatable -->
<div class="panel panel-flat">
    <table id="tbl_data" class="table datatable-basic">
        <thead>
            <tr>
                <th width="10%"><?php echo __('Lanaguage', array(), 'Lanaguage');?></th>
                <th width="35%"><?php echo __('Origin Content', array(), 'Origin Content');?></th>
                <th width="35%"><?php echo __('Translate Content', array(), 'Translate Content');?></th>
                <th width="10%"><?php echo __('Status', array(), 'Status');?></th>
                <th width="10%" class="text-center"></th>
            </tr>
        </thead>
    </table>
</div>
<!-- /basic datatable -->

<div id="modal_form" class="modal fade">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div id="content_area"></div>
        </div>
    </div>
</div>

<?php
    $linkLoadForm = Uri::create('system/translate/form');
    $linkLoadData = Uri::create('system/translate/load_item_data');
    $linkDelete = Uri::create('system/translate/status_item?type_action=delete');
    $linkStatus = Uri::create('system/translate/status_item?type_action=status');  

?>
<script>
$(function(){
    var table = $('#tbl_data').DataTable({
        bServerSide   : true,
        sAjaxSource   : '<?php echo @$linkLoadData?>',
        columns:[
            {'data' : 'language'},
            {'data' : 'key'},
            {'data' : 'value'},
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

    $('#tbl_data').on('click', '.ajax-modal', function () {
        loadForm($(this));
    });

    $('.ajax-modal').click(function(){
        loadForm($(this));
    })

    $('#modal_form').on('hidden.bs.modal', function () {
        table.draw(false);
    })
})

function loadForm(element){
    var id = element.parents('tr').attr('id');
    $('#modal_form #content_area').load('<?php echo $linkLoadForm;?>', {id:id},function(data){
        $('#modal_form').modal({show:true});
    }, 'json');
    return false;
}
</script>