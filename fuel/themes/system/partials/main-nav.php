<?php

    $xhtmlNav = '<li class="dropdown">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                        <i class="icon-gear position-left"></i> ' . __('System', [], 'System') . ' <span class="caret"></span>
                    </a>
                    <ul class="dropdown-menu width-250">
                        <li class="dropdown-header highlight">' . __('Human Resouce', [], 'Human Resouce') . '</li>
                        <li><a href="' . \Uri::create('system/user') . '"><i class="icon-people"></i> ' . __('User Management', [], 'User Management') . ' </a></li>
                        <li><a href="' . \Uri::create('system/group') . '"><i class="icon-collaboration"></i> ' . __('Group Management', [], 'Group Management') . ' </a></li>
                        <li class="dropdown-header highlight">' . __('Permission', [], 'Permission') . '</li>
                        <li><a href="' . \Uri::create('system/role') . '"><i class="icon-user-block"></i> ' . __('Role Management', [], 'Role Management') . ' </a></li>
                        <li class="dropdown-header highlight">' . __('Language', [], 'Language') . '</li>
                        <li><a href="' . \Uri::create('system/language') . '"><i class="icon-flag3"></i> ' . __('Language Management', [], 'Language Management') . ' </a></li>
                        <li><a href="' . \Uri::create('system/translate') . '"><i class="icon-spell-check"></i> ' . __('Translate Management', [], 'Translate Management') . ' </a></li>
                    </ul>
                </li>';
    $xhtmlNav .= '<li class="dropdown">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                        <i class="icon-drawer-out position-left"></i> ' . __('Deploy', [], 'Deploy') . ' <span class="caret"></span>
                    </a>
                    <ul class="dropdown-menu width-250">
                        <li><a href="' . \Uri::create('deploy/project') . '"><i class="icon-folder6"></i> ' . __('Project Management', [], 'Project Management') . ' </a></li>
                        <li><a href="' . \Uri::create('deploy/index') . '"><i class="icon-user-tie"></i> ' . __('List User Project', [], 'List User Project') . ' </a></li>
                    </ul>
                </li>';

    $xhtmlNav .= '<li class="dropdown">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                        <i class="icon-home position-left"></i> ' . __('Portal System', [], 'Portal System') . ' <span class="caret"></span>
                    </a>
                    <ul class="dropdown-menu width-250">
                        <li><a href="' . \Uri::create('portalsystem/portalslide') . '"><i class="icon-images2"></i> ' . __('Slide Management', [], 'Slide Management') . ' </a></li>
                        <li><a href="' . \Uri::create('portalsystem/portalskill') . '"><i class="icon-user-plus"></i> ' . __('Skill Management', [], 'Skill Management') . ' </a></li>
                        <li><a href="' . \Uri::create('portalsystem/portalservice') . '"><i class="icon-spinner4"></i> ' . __('Service Management', [], 'Service Management') . ' </a></li>
                        <li><a href="' . \Uri::create('portalsystem/portalbranch') . '"><i class=" icon-tree5"></i> ' . __('Branch Management', [], 'Branch Management') . ' </a></li>
                        <li><a href="' . \Uri::create('portalsystem/portalteam') . '"><i class="icon-users4"></i> ' . __('Team Management', [], 'Team Management') . ' </a></li>
                        <li><a href="' . \Uri::create('portalsystem/portalnews') . '"><i class="icon-newspaper"></i> ' . __('News Management', [], 'News Management') . ' </a></li>
                        <li><a href="' . \Uri::create('portalsystem/portalclient') . '"><i class="icon-user-tie"></i> ' . __('Client Management', [], 'Client Management') . ' </a></li>
                        <li><a href="' . \Uri::create('portalsystem/portalrecruitment') . '"><i class="icon-user-check"></i> ' . __('Recruitment Management', [], 'Recruitment Management') . ' </a></li>
                    </ul>
                </li>';

?>

<!-- Second navbar -->
<div class="navbar navbar-default" id="navbar-second">
    <ul class="nav navbar-nav no-border visible-xs-block">
        <li><a class="text-center collapsed" data-toggle="collapse" data-target="#navbar-second-toggle"><i class="icon-menu7"></i></a></li>
    </ul>

    <div class="navbar-collapse collapse" id="navbar-second-toggle">
        <ul class="nav navbar-nav">
            <?php echo $xhtmlNav;?>
        </ul>
    </div>
</div>
<!-- /second navbar -->