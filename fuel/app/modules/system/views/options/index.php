<!-- Basic datatable -->
<div class="panel panel-flat">

    <table id="tbl_data" class="table datatable-basic">
        <thead>
            <tr>
                
                <th><?php echo __('Option Name', array(), 'Option Name');?></th>
                <th><?php echo __('Option Value', array(),'Option Value');?></th>
                <th class="text-center"></th>
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
    $linkLoadForm = Uri::create('system/options/form');
    $linkLoadData = Uri::create('system/options/load_item_data');
    $linkDelete = Uri::create('system/options/status_item?type_action=delete');
?>
<script>
$(function(){
    var table = $('#tbl_data').DataTable({
        bServerSide   : true,
        sAjaxSource   : '<?php echo @$linkLoadData?>',
        columns:[
            {'data' : 'name'},
            {'data' : 'value'},
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