<?php

error_reporting(1);
ini_set('default_socket_timeout', 10000);
extract($_REQUEST);
header('Content-Type: text/html; charset=utf-8');

include("baseclass.php");
include("language/en.php");
$app_idd = "A100DU89544";
if (empty($tag)) {
    $reponse->message = $lang["404_tag"];
    $reponse->error = 1;
    $reponse->success = 0;
} elseif (empty($app_id)) {

    $reponse->message = $lang["404_app_id"];
    $reponse->error = 1;
    $reponse->success = 0;
} elseif ($app_id != $app_idd) {
    $reponse->message = $lang["invalid_app_id"];
    $reponse->error = 1;
    $reponse->success = 0;
}

/*
 * NAME         : GetUserFolders
 * Method       : GET 
 * PARAMS       : user_id,tag,api_id
 * URL          : json.php?tag=GetUserFolders&app_id=A100DU89544&user_id=1
 * RESPONSE     : message (object),error (object), success (object), data (array)
 * DESCRIPTION  : this api is used to get folders of users
 */ elseif ($tag == "GetUserFolders") {
    if (empty($user_id)) {
        $reponse->message = $lang["404_user_id"];
        $reponse->error = 1;
        $reponse->success = 0;
    } else {
        $user_data = (array) $response->getUserRecords($user_id);

        if (count($user_data) > 0) {
            $user_data = $user_data[0];
            $permission = explode(",", $user_data->permissions);
            $permiss = array();
            $permiss["View"] = 0;
            $permiss["Delete"] = 0;
            $permiss["Share"] = 0;
            $permiss["Create"] = 0;
            $permiss["Edit"] = 0;

            foreach ($permission as $perm) {
                if ($perm == "View") {
                    $permiss["View"] = 1;
                }
                if ($perm == "Delete") {
                    $permiss["Delete"] = 1;
                }
                if ($perm == "Share") {
                    $permiss["Share"] = 1;
                }
                if ($perm == "Create") {
                    $permiss["Create"] = 1;
                }
                if ($perm == "Edit") {
                    $permiss["Edit"] = 1;
                }
            }
            $reponse->Permission = $permiss;
            if (empty($user_data->user_folder_id)) {

                $folder_name = $user_data->ID . "_" . $user_data->display_name;
                $folder_id = $response->CreateFolder($user_data->ID, "", $folder_name);

                $per_fold_id = $response->CreateFolder($user_data->ID, $folder_id, $lang["personal_files"]);
                $share_fold_id = $response->CreateFolder($user_data->ID, $folder_id, $lang["share_files"]);
                $note_fold_id = $response->CreateFolder($user_data->ID, $folder_id, $lang["notes"]);
                $fields = array();
                $fields["user_folder_id"] = $folder_id;
                $fields["personal_folder_id"] = $per_fold_id;
                $fields["share_folder_id"] = $share_fold_id;
                $fields["note_folder_id"] = $note_fold_id;
                $response->UpdateUserData($user_id, $fields);

                $user = $response->GetUserFolder($folder_id);
                $reponse->message = $lang["files_list"];
                $reponse->Data = $user;
                $reponse->error = 0;
                $reponse->success = 1;
            } else {
                $user = $response->GetUserFolder($user_data->user_folder_id);
                $reponse->message = $lang["files_list"];
                $reponse->Data = $user;
                $reponse->error = 0;
                $reponse->success = 1;
            }
        } else {
            $reponse->message = $lang["invalid_user_id"];
            $reponse->error = 1;
            $reponse->success = 0;
        }
    }
}
/*
 * NAME         : GetFolderChildById 
 * Method       : GET 
 * PARAMS       : user_id,tag,api_id,folder_id
 * URL          : json.php?tag=GetFolderChildById&app_id=A100DU89544&user_id=1&folder_id=0B6sVujZ1I6r-dVI2enF6dFNkWHM
 * RESPONSE     : message (object),error (object), success (object), data (array)
 * DESCRIPTION  : this api is used to get folders childs
 */ elseif ($tag == "GetFolderChildById") {
    if (empty($user_id)) {
        $reponse->message = $lang["404_user_id"];
        $reponse->error = 1;
        $reponse->success = 0;
    } elseif (empty($folder_id)) {
        $reponse->message = $lang["404_folder"];
        $reponse->error = 1;
        $reponse->success = 0;
    } else {
        $user = $response->GetUserFolder($folder_id);
        if (count($user) > 0) {
            $reponse->message = $lang['success_subfolder_files'];
            $reponse->Data = $user;
            $reponse->error = 0;
            $reponse->success = 1;
        } else {
            $reponse->message = $lang['404_subfolder'];
            $reponse->error = 1;
            $reponse->success = 0;
        }
    }
}




/*
 * NAME         : EditWorkspaceFile 
 * Method       : POST 
 * PARAMS       : user_id,tag,api_id,file_id,file
 * URL          : json.php?tag=EditWorkspaceFile
 * RESPONSE     : message (object),error (object), success (object), data (array)
 * DESCRIPTION  : this api is used to edit workspace file
 */ elseif ($tag == "EditWorkspaceFile") {

    $file_name = $_FILES['file']["name"];

    $ext = end(explode('.', $file_name));

    if (empty($user_id)) {
        $reponse->message = $lang["404_user_id"];
        $reponse->error = 1;
        $reponse->success = 0;
    } elseif (empty($file_name)) {
        $reponse->message = $lang['404_file'];
        $reponse->error = 1;
        $reponse->success = 0;
    } 
    elseif (empty($file_id)) {
        $reponse->message = $lang['404_file'];
        $reponse->error = 1;
        $reponse->success = 0;
    } 

    elseif ($ext != "pdf") {
        $reponse->message = $lang['404_fileformate'];
        $reponse->error = 1;
        $reponse->success = 0;
    } else {
        $user_data = $response->getUserRecords($user_id);
        $user_data = $user_data[0];
        if (empty($user_data->permissions)) {
            $reponse->message = "You have no permissions to edit file.";
            $reponse->error = 1;
            $reponse->success = 0;
        } else {
            $permission_lvl = explode(",", $user_data->permissions);
            if (array_search("Edit", $permission_lvl) == true) {
                if (count($user_data) > 0) {
                    $user = $response->EditWorkspaceFile($user_id, $file_id, $_FILES['file']);
                    if (!empty($user)) {
                        $reponse->message = $lang['succs_file_list'];
                        $reponse->Data = $user['id'];
                        $reponse->error = 0;
                        $reponse->success = 1;
                    } else {
                        $reponse->message = $lang['404_no_file_upload'];
                        $reponse->error = 1;
                        $reponse->success = 0;
                    }
                } else {
                    $reponse->message = $lang["invalid_user_id"];
                    $reponse->error = 1;
                    $reponse->success = 0;
                }
            } else {
                $reponse->message = "You have no permissions to edit file.";
                $reponse->error = 1;
                $reponse->success = 0;
            }
        }
    }
}



/*
 * NAME         : UploadFile 
 * Method       : POST 
 * PARAMS       : user_id,tag,api_id,folder_id,file
 * URL          : json.php?tag=UploadFile
 * RESPONSE     : message (object),error (object), success (object), data (array)
 * DESCRIPTION  : this api is used to upload folder
 */ elseif ($tag == "UploadFile") {

    $file_name = $_FILES['file']["name"];

    $ext = end(explode('.', $file_name));

    if (empty($user_id)) {
        $reponse->message = $lang["404_user_id"];
        $reponse->error = 1;
        $reponse->success = 0;
    } elseif (empty($folder_id)) {
        $reponse->message = $lang["404_folder"];
        $reponse->error = 1;
        $reponse->success = 0;
    } elseif (empty($file_name)) {
        $reponse->message = $lang['404_file'];
        $reponse->error = 1;
        $reponse->success = 0;
    } elseif ($ext != "pdf") {
        $reponse->message = $lang['404_fileformate'];
        $reponse->error = 1;
        $reponse->success = 0;
    } else {
        $user_data = $response->getUserRecords($user_id);
        $user_data = $user_data[0];
        if (empty($user_data->permissions)) {
            $reponse->message = $lang['file_create_permission'];
            $reponse->error = 1;
            $reponse->success = 0;
        } else {
            $permission_lvl = explode(",", $user_data->permissions);
            if (array_search("Create", $permission_lvl) == true) {
                if (count($user_data) > 0) {
                    $user = $response->UploadFile($user_id, $folder_id, $_FILES['file']);
                    if (!empty($user)) {
                        $reponse->message = $lang['succs_file_list'];
                        $reponse->Data = $user['id'];
                        $reponse->error = 0;
                        $reponse->success = 1;
                    } else {
                        $reponse->message = $lang['404_no_file_upload'];
                        $reponse->error = 1;
                        $reponse->success = 0;
                    }
                } else {
                    $reponse->message = $lang["invalid_user_id"];
                    $reponse->error = 1;
                    $reponse->success = 0;
                }
            } else {
                $reponse->message = $lang['file_create_permission'];
                $reponse->error = 1;
                $reponse->success = 0;
            }
        }
    }
}

/*
 * NAME         : UploadFileFromLink
 * Method       : POST 
 * PARAMS       : user_id,tag,api_id,folder_id,file_link
 * URL          : json.php?tag=UploadFileFromLink
 * RESPONSE     : message (object),error (object), success (object), data (array)
 * DESCRIPTION  : this api is used to upload folder
 */ elseif ($tag == "UploadFileFromLink") {
    
    
   $file_link = str_replace('_', '%20', $file_link);
   
    if (empty($user_id)) {
        $reponse->message = $lang["404_user_id"];
        $reponse->error = 1;
        $reponse->success = 0;
    } elseif (empty($file_link)) {
        $reponse->message = $lang['404_file'];
        $reponse->error = 1;
        $reponse->success = 0;
    } else {
        $user_data = $response->getUserRecords($user_id);
        $user_data = $user_data[0];
        $folder_id = $user_data->personal_folder_id;
        /*if (empty($user_data->permissions)) {
            $reponse->message = $lang['file_create_permission'];
            $reponse->error = 1;
            $reponse->success = 0;
        } else { */
            $permission_lvl = explode(",", $user_data->permissions);
           // if (array_search("Create", $permission_lvl) == true) {
                if (count($user_data) > 0) {
                    $data_link = $response->CheckFileLink($file_link, $user_id);
                   // print_r($data_link);  exit;
                    if (empty($data_link)) {
                        $user = $response->UploadFileFromLink($user_id, $folder_id, $file_link);
                        if (!empty($user)) {
                            $d = array();
                            $d['file_id'] = $user['id'];
                            $d['isFolder'] = 0;
                            $d['file_name'] = $user['title'];
                            $d['downloadlink'] = $file_link;
                            $d['orignal_file'] = "";
                            $reponse->message = $lang['upload_file'];
                            $reponse->Data = $d;
                            $reponse->error = 0;
                            $reponse->success = 1;
                        } else {
                            $reponse->message = $lang['404_no_file_upload'];
                            $reponse->error = 1;
                            $reponse->success = 0;
                        }
                    } else {
                        $d = array();
                        $d['file_id'] = $data_link->file_id;
                        $d['isFolder'] = 0;
                        $d['file_name'] = $data_link->file_name;
                        $d['downloadlink'] = $data_link->downloadlink;
                        $d['orignal_file'] = $data_link->orignal_file_download_link;
                        $reponse->message = $lang->upload_file;
                        $reponse->Data = $d;
                        $reponse->error = 0;
                        $reponse->success = 1;
                    }
                } else {
                    $reponse->message = $lang["invalid_user_id"];
                    $reponse->error = 1;
                    $reponse->success = 0;
                }
           /* } else {
                $reponse->message = $lang['file_create_permission'];
                $reponse->error = 1;
                $reponse->success = 0;
            } */
       // }
    }
}

/*
 * NAME         : CreateNote 
 * Method       : POST 
 * PARAMS       : user_id,tag,api_id,file,type (commite,for_approval,single_user ),sender_id,group_id
 * URL          : json.php?tag=CreateNote
 * RESPONSE     : message (object),error (object), success (object), data (array)
 * DESCRIPTION  : this api is used to upload folder
 */ elseif ($tag == "CreateNote") {

    $file_name = $_FILES['file']["name"];

    $ext = end(explode('.', $file_name));

    if (empty($user_id)) {
        $reponse->message = $lang["404_user_id"];
        $reponse->error = 1;
        $reponse->success = 0;
    } elseif (empty($file_name)) {
        $reponse->message = "file not found";
        $reponse->error = 1;
        $reponse->success = 0;
    } elseif (empty($type)) {
        $reponse->message = "type Not Found.";
        $reponse->error = 1;
        $reponse->success = 0;
    } elseif ($type == "single_user" && empty($sender_id)) {

        $reponse->message = $lang['404_sender_id'];
        $reponse->error = 1;
        $reponse->success = 0;
    } elseif (($type == "commite" || $type == "for_approval") && empty($group_id)) {

        $reponse->message = $lang['404_group_id'];
        $reponse->error = 1;
        $reponse->success = 0;
    } else {

        $user_data = $response->getUserRecords($user_id);
			
        $user_data = $user_data[0];
        $share_folder_id = $user_data->note_folder_id;
        if (empty($user_data->permissions)) {
            $reponse->message = $lang['file_create_permission'];
            $reponse->error = 1;
            $reponse->success = 0;
        } else {
            $permission_lvl = explode(",", $user_data->permissions);
            if (array_search("Create", $permission_lvl) == true) {
                if (count($user_data) > 0) {
                    $user = $response->CreateNote($user_id, $share_folder_id, $_FILES['file']);
                    
                       
                    $file_id = $user['id'];
                    $file_res = $response->GetNoteDetail($file_id,$user_id);
                    ///////////////////////////share file/////
                    $files_Data = (array) $response->getNoteRecords($file_id);

                    if ($type == "single_user") {
                        $users_SP = $response->getMultipleUserRecords($sender_id);

                        foreach ($users_SP as $u) {
                          

                            $_REQUEST["sender_id"] = $u->ID;
                            $_REQUEST["reg_id"] = $u->regID;
                            $_REQUEST["file_id"] = $file_id;
                            $_REQUEST["sender_name"] = $user_data->user_login;
                            $response->ShareNote($type, $_REQUEST);
                        }

                    } else if ($type == "commite" || $type == "for_approval") {

                        $users = $response->getGroupsUsers($group_id);
                        $chairmain_id = $response->getChairManID($group_id);
                        foreach ($users as $u) {
                            $_REQUEST["sender_id"] = $u->user_id;
                            if ($type == 'for_approval') {
                                if ($u->user_id != $chairmain_id) {
                                    $_REQUEST['chairmain_id'] = $chairmain_id;
                                    $_REQUEST["reg_id"] = $u->regID;
                                    $_REQUEST["file_id"] = $file_id;
                                    $response->ShareNote($type, $_REQUEST);
                                }
                            } else {
                                $_REQUEST["reg_id"] = $u->regID;
                                $_REQUEST["file_id"] = $file_id;
                                $response->ShareNote($type, $_REQUEST);
                            }
                        }
                    }
                    //////////////////////// share file end/////

                    if (!empty($user)) {
                        $reponse->message = $lang['succs_create_note'];
                        $reponse->Data = $file_res;
                        $reponse->error = 0;
                        $reponse->success = 1;
                    } else {
                        $reponse->message = $lang['404_no_file_upload'];
                        $reponse->error = 1;
                        $reponse->success = 0;
                    }
                } else {
                    $reponse->message = $lang["invalid_user_id"];
                    $reponse->error = 1;
                    $reponse->success = 0;
                }
            } else {
                $reponse->message = $lang['file_create_permission'];
                $reponse->error = 1;
                $reponse->success = 0;
            }
        }
    }
}
/*
 * NAME         : EditFile 
 * Method       : POST 
 * PARAMS       : user_id,tag,api_id,file_id,file
 * URL          : json.php?tag=EditFile
 * RESPONSE     : message (object),error (object), success (object), data (array)
 * DESCRIPTION  : this api is used to edit folder
 */ elseif ($tag == "EditFile") {

    $file_name = $_FILES['file']["name"];

    $ext = end(explode('.', $file_name));

    if (empty($user_id)) {
        $reponse->message = $lang["404_user_id"];
        $reponse->error = 1;
        $reponse->success = 0;
    } elseif (empty($file_id)) {
        $reponse->message = $lang["404_folder"];
        $reponse->error = 1;
        $reponse->success = 0;
    } elseif (empty($file_name)) {
        $reponse->message = $lang['404_file'];
        $reponse->error = 1;
        $reponse->success = 0;
    } elseif ($ext != "pdf") {
        $reponse->message = $lang['404_fileformate'];
        $reponse->error = 1;
        $reponse->success = 0;
    } else {
        $user_data = (array) $response->getUserRecords($user_id);
        $user_data = $user_data[0];
        if (empty($user_data->permissions)) {
            $reponse->message = $lang['file_edit_permission'];
            $reponse->error = 1;
            $reponse->success = 0;
        } else {
            $permission_lvl = explode(",", $user_data->permissions);
            if (array_search("Edit", $permission_lvl) == true) {
                if (count($user_data) > 0) {
                    $user = $response->EditFile($user_id, $file_id, $_FILES['file']);
                    //print_r($user); exit;
                    if (!empty($user)) {
                        $reponse->message = $lang['succs_edit_file'];
                        $fields = array();
                        $fields["file_id"] = $user["id"];
                        $fields["downloadlink"] = $user["webContentLink"];
                        //$reponse->Data->downloadlink = $user['webContentLink'];
                        $reponse->Data = $fields;
                        $reponse->error = 0;
                        $reponse->success = 1;
                    } else {
                        $reponse->message = $lang['404_no_file_upload'];
                        $reponse->error = 1;
                        $reponse->success = 0;
                    }
                } else {
                    $reponse->message = $lang["invalid_user_id"];
                    $reponse->error = 1;
                    $reponse->success = 0;
                }
            } else {
                $reponse->message = $lang['file_edit_permission'];
                $reponse->error = 1;
                $reponse->success = 0;
            }
        }
    }
}
/*
 * NAME         : EditNote
 * Method       : POST 
 * PARAMS       : user_id,tag,api_id,file_id,file
 * URL          : json.php?tag=EditNote
 * RESPONSE     : message (object),error (object), success (object), data (array)
 * DESCRIPTION  : this api is used to edit folder
 */ elseif ($tag == "EditNote") {

    $file_name = $_FILES['file']["name"];

    $ext = end(explode('.', $file_name));

    if (empty($user_id)) {
        $reponse->message = "user_id Not Found.";
        $reponse->error = 1;
        $reponse->success = 0;
    } elseif (empty($file_id)) {
        $reponse->message = "file_id Not Found.";
        $reponse->error = 1;
        $reponse->success = 0;
    } elseif (empty($file_name)) {
        $reponse->message = "Note Not Found.";
        $reponse->error = 1;
        $reponse->success = 0;
    } elseif ($ext != "pdf") {
        $reponse->message = "Note format must be PDF.";
        $reponse->error = 1;
        $reponse->success = 0;
    } else {
        $user_data = (array) $response->getUserRecords($user_id);
        $user_data = $user_data[0];
        if (empty($user_data->permissions)) {
            $reponse->message = "You have No Permission to Edit a Note.";
            $reponse->error = 1;
            $reponse->success = 0;
        } else {
            $permission_lvl = explode(",", $user_data->permissions);
            if (array_search("Edit", $permission_lvl) == true) {
                if (count($user_data) > 0) {
                    $user = $response->EditNote($user_id, $file_id, $_FILES['file']);
                    if (!empty($user)) {
                        $reponse->message = "Successfully Edit Note.";
                        $reponse->Data = $user;
                        $reponse->error = 0;
                        $reponse->success = 1;
                    } else {
                        $reponse->message = "No file upload.";
                        $reponse->error = 1;
                        $reponse->success = 0;
                    }
                } else {
                    $reponse->message = "Invalid User Id.";
                    $reponse->error = 1;
                    $reponse->success = 0;
                }
            } else {
                $reponse->message = "You have No Permission to Edit a Note.";
                $reponse->error = 1;
                $reponse->success = 0;
            }
        }
    }
}
/*
 * NAME         : Help 
 * Method       : POST 
 * PARAMS       : user_id,tag,api_id
 * URL          : json.php?tag=Help&app_id=A100DU89544&user_id=1
 * RESPONSE     : message (object),error (object), success (object), data (array)
 * DESCRIPTION  : this api is used help.
 * 
 */ elseif ($tag == "Help") {
    if (empty($user_id)) {
        $reponse->message = "user_id Not Found.";
        $reponse->error = 1;
        $reponse->success = 0;
    } else {
        $rows = $response->AddHelpReq($user_id);
        if ($rows) {
            $reponse->message = "help request sent successfully.";
            $reponse->error = 0;
            $reponse->success = 1;
        } else {
            $reponse->message = "Problem in adding help request.";
            $reponse->error = 1;
            $reponse->success = 0;
        }
    }
}
/*
 * NAME         : getUsers 
 * Method       : GET 
 * PARAMS       : tag,api_id,user_id
 * URL          : json.php?tag=getUsers&app_id=A100DU89544&user_id=1
 * RESPONSE     : message (object),error (object), success (object), data (array)
 * DESCRIPTION  : this api is used to get all users.
 * 
 */ elseif ($tag == "getUsers") {

if (empty($user_id)) {
        $reponse->message = "user_id Not Found.";
        $reponse->error = 1;
        $reponse->success = 0;
    } else {

    $rows = $response->getUsers($user_id);
    if (count($rows)) {
        $reponse->message = "get user successfully.";
        $reponse->error = 0;
        $reponse->success = 1;
        $reponse->Data = $rows;
    } else {
        $reponse->message = "no record found";
        $reponse->error = 0;
        $reponse->success = 1;
    }
}
}
/*
 * NAME         : getCommites 
 * Method       : GET 
 * PARAMS       : tag,api_id
 * URL          : json.php?tag=getCommites&app_id=A100DU89544
 * RESPONSE     : message (object),error (object), success (object), data (array)
 * DESCRIPTION  : this api is used to get all users.
 * 
 */ elseif ($tag == "getCommites") {

    $rows = $response->getCommites();
    if (count($rows) > 0) {
        $reponse->message = "getting commites successfully. ";
        $reponse->error = 0;
        $reponse->success = 1;
        $reponse->Data = $rows;
    } else {
        $reponse->message = "no record found";
        $reponse->error = 1;
        $reponse->success = 0;
    }
}
/*
 * NAME         : UpdateRegID 
 * Method       : GET 
 * PARAMS       : user_id,tag,api_id,reg_id
 * URL          : json.php?tag=UpdateRegID&app_id=A100DU89544&user_id=1&reg_id=asdfasdfasd
 * RESPONSE     : message (object),error (object), success (object), data (array)
 * DESCRIPTION  : this api is used to update regid 
 * 
 */ elseif ($tag == "UpdateRegID") {
    if (empty($user_id)) {
        $reponse->message = "user_id Not Found.";
        $reponse->error = 1;
        $reponse->success = 0;
    } else if (empty($reg_id)) {
        $reponse->message = "reg_id Not Found.";
        $reponse->error = 1;
        $reponse->success = 0;
    } else {
        $rows = $response->UpdateRegID($user_id, $reg_id);
        if ($rows) {
            $reponse->message = "Reg id Update successfully.";
            $reponse->error = 0;
            $reponse->success = 1;
        } else {
            $reponse->message = " Problem in updating in regid.";
            $reponse->error = 1;
            $reponse->success = 0;
        }
    }
}
/*
 * NAME         : ShareFile 
 * Method       : GET 
 * PARAMS       : user_id,tag,api_id,file_id,type (commite,any_on_with_link,every_one,specific_user ),sender_id,group_id
 * URL          : json.php?tag=ShareFile
 * http://localhost/googledrive2/apis/json.php?tag=ShareFile&app_id=A100DU89544&user_id=1&file_id=0B6sVujZ1I6r-VFZnRmlDRmoxM3M&type=commite&group_id=1
 * RESPONSE     : message (object),error (object), success (object), data (array)
 * DESCRIPTION  : this api is used to get folders of users
 */ elseif ($tag == "ShareFile") {
    if (empty($user_id)) {
        $reponse->message = "user_id Not Found.";
        $reponse->error = 1;
        $reponse->success = 0;
    } elseif (empty($file_id)) {
        $reponse->message = "file_id Not Found.";
        $reponse->error = 1;
        $reponse->success = 0;
    } elseif (empty($type)) {
        $reponse->message = "type Not Found.";
        $reponse->error = 1;
        $reponse->success = 0;
    } else {
        $user_data = (array) $response->getUserRecords($user_id);
        $user_data = $user_data[0];
        if (empty($user_data->permissions)) {
            $reponse->message = "You have No Permission to Share a file.";
            $reponse->error = 1;
            $reponse->success = 0;
        } else {
            $permission_lvl = explode(",", $user_data->permissions);
            if (array_search("Share", $permission_lvl) == true) {
                if (count($user_data) > 0) {
                    $files_Data = (array) $response->getFileRecords($file_id);
                    if ($type == "specific_user") {
                        if (empty($sender_id)) {
                            $reponse->message = "sender_id not found.";
                            $reponse->error = 1;
                            $reponse->success = 0;
                        } else {
                            $users_SP = $response->getMultipleUserRecords($sender_id);
                            //$sender_data = $sender_data[0];
                            //print_r($users_SP); exit;
                            if (count($files_Data) <= 0) {
                                $reponse->message = "Invalid File ID.";
                                $reponse->error = 1;
                                $reponse->success = 0;
                            } else if (count($users_SP) > 0) {
                                foreach ($users_SP as $u) {
                                    $sender_data = (array) $response->getUserRecords($u->ID);
                                    $sender_data = $sender_data[0];
                                    $_REQUEST["folder_id"] = $sender_data->share_folder_id;
                                    $_REQUEST["download_link"] = $files_Data['downloadlink'];
                                    $_REQUEST["reg_id"] = $u->regID;
                                    $_REQUEST["title"] = $files_Data['file_name'];
                                    $_REQUEST["sender_id"] = $u->ID;
                                    $_REQUEST["sender_name"] = $user_data->user_login;
                                    $response->ShareDoc($type, $_REQUEST);
                                }
                                $reponse->message = "Successfully share document.";
                                $reponse->error = 0;
                                $reponse->success = 1;
                            } else {
                                $reponse->message = "Invalid Sender Id.";
                                $reponse->error = 1;
                                $reponse->success = 0;
                            }
                        }
                    } else if ($type == "commite") {
                        if (empty($group_id)) {
                            $reponse->message = "group id not found.";
                            $reponse->error = 1;
                            $reponse->success = 0;
                        } else {

                            $users = $response->getMultipleGroupsUsers($group_id);

                            foreach ($users as $u) {
                                $sender_data = (array) $response->getUserRecords($u->user_id);
                                $sender_data = $sender_data[0];
                                $_REQUEST["folder_id"] = $sender_data->share_folder_id;
                                $_REQUEST["download_link"] = $files_Data['downloadlink'];
                                $_REQUEST["reg_id"] = $u->regID;
                                $_REQUEST["title"] = $files_Data['file_name'];
                                $_REQUEST["sender_id"] = $u->user_id;
                                $_REQUEST["sender_name"] = $u->user_login;
                                $response->ShareDoc($type, $_REQUEST);
                            }
                            $reponse->message = "Successfully share document.";
                            $reponse->error = 0;
                            $reponse->success = 1;
                        }
                    } else if ($type == "every_one" || $type == "any_on_with_link") {
                        $users = $response->getAllAssignUsers($user_id);
                        foreach ($users as $u) {
                            $_REQUEST["folder_id"] = $u->share_folder_id;
                            $_REQUEST["download_link"] = $files_Data['downloadlink'];
                            $_REQUEST["title"] = $files_Data['file_name'];
                            $_REQUEST["reg_id"] = $u->regID;
                            $_REQUEST["sender_name"] = $u->user_login;
                            $_REQUEST["sender_id"] = $u->user_id;
                            $response->ShareDoc($type, $_REQUEST);

                            $reponse->message = "Successfully share document.";
                            $reponse->error = 0;
                            $reponse->success = 1;
                        }
                    }
                } else {
                    $reponse->message = "Invalid User Id.";
                    $reponse->error = 1;
                    $reponse->success = 0;
                }
            } else {
                $reponse->message = "You have No Permission to Edit a file.";
                $reponse->error = 1;
                $reponse->success = 0;
            }
        }
    }
}
/*
 * NAME         : ShareNote
 * Method       : GET 
 * PARAMS       : user_id,tag,api_id,file_id,type (commite,for_approval,single_user ),sender_id,group_id
 * URL          : json.php?tag=ShareNote
 * http://localhost/googledrive2/apis/json.php?tag=ShareFile&app_id=A100DU89544&user_id=1&file_id=0B6sVujZ1I6r-VFZnRmlDRmoxM3M&type=commite&group_id=1
 * RESPONSE     : message (object),error (object), success (object), data (array)
 * DESCRIPTION  : this api is used to share notes
 */ elseif ($tag == "ShareNote") {
    if (empty($user_id)) {
        $reponse->message = "user_id Not Found.";
        $reponse->error = 1;
        $reponse->success = 0;
    } elseif (empty($file_id)) {
        $reponse->message = "file_id Not Found.";
        $reponse->error = 1;
        $reponse->success = 0;
    } elseif (empty($type)) {
        $reponse->message = "type Not Found.";
        $reponse->error = 1;
        $reponse->success = 0;
    } else {
        $user_data = (array) $response->getUserRecords($user_id);

        $user_data = $user_data[0];
        if (empty($user_data->permissions)) {
            $reponse->message = "You have No Permission to Share a file.";
            $reponse->error = 1;
            $reponse->success = 0;
        } else {
            $permission_lvl = explode(",", $user_data->permissions);
            if (array_search("Share", $permission_lvl) == true) {
                if (count($user_data) > 0) {
                    $files_Data = (array) $response->getNoteRecords($file_id);
                    if ($type == "single_user") {
                        if (empty($sender_id)) {
                            $reponse->message = "sender_id not found.";
                            $reponse->error = 1;
                            $reponse->success = 0;
                        } else {
                            // $sender_data = (array) $response->getUserRecords($sender_id);
                            $users_SP = $response->getMultipleUserRecords($sender_id);
                            //$sender_data = $sender_data[0];

                            if (count($files_Data) <= 0) {
                                $reponse->message = "Invalid File ID.";
                                $reponse->error = 1;
                                $reponse->success = 0;
                            } else if (count($users_SP) > 0) {
                                foreach ($users_SP as $u) {
                                    $_REQUEST["sender_id"] = $u->ID;
                                    $_REQUEST["reg_id"] = $u->regID;
                                    $_REQUEST["sender_name"] = $user_data->user_login;
                                    $response->ShareNote($type, $_REQUEST);
                                }
                                $reponse->message = "Successfully share note.";
                                $reponse->error = 0;
                                $reponse->success = 1;
                            } else {
                                $reponse->message = "Invalid Sender Id.";
                                $reponse->error = 1;
                                $reponse->success = 0;
                            }
                        }
                    } else if ($type == "commite" || $type == "for_approval") {
                        if (empty($group_id)) {
                            $reponse->message = "group id not found.";
                            $reponse->error = 1;
                            $reponse->success = 0;
                        } else {
                            $users = $response->getGroupsUsers($group_id);
                            $chairmain_id = $response->getChairManID($group_id);
                            foreach ($users as $u) {
                                $_REQUEST["sender_id"] = $u->user_id;
                                if ($type == 'for_approval') {
                                    if ($u->user_id != $chairmain_id) {
                                        $_REQUEST['chairmain_id'] = $chairmain_id;
                                        $_REQUEST["reg_id"] = $u->regID;
                                        $response->ShareNote($type, $_REQUEST);
                                    }
                                } else {
                                    $_REQUEST["reg_id"] = $u->regID;
                                    $response->ShareNote($type, $_REQUEST);
                                }
                            }
                            $reponse->message = "Successfully share note.";
                            $reponse->error = 0;
                            $reponse->success = 1;
                        }
                    }
                } else {
                    $reponse->message = "Invalid User Id.";
                    $reponse->error = 1;
                    $reponse->success = 0;
                }
            } else {
                $reponse->message = "You have No Permission to share a Note.";
                $reponse->error = 1;
                $reponse->success = 0;
            }
        }
    }
}
/*
 * NAME         : GiveVote 
 * Method       : GET 
 * PARAMS       : user_id,tag,api_id,file_id,is_approved
 * URL          : json.php?tag=GiveVote&app_id=A100DU89544&user_id=1&file_id=asdfga&$is_approved=1 or 0
 * RESPONSE     : message (object),error (object), success (object), data (array)
 * DESCRIPTION  : this api is used give vote to file .
 * 
 */ elseif ($tag == "GiveVote") {

    if (empty($user_id)) {
        $reponse->message = "user_id Not Found.";
        $reponse->error = 1;
        $reponse->success = 0;
    } else if (empty($file_id)) {
        $reponse->message = "file_id  Not Found.";
        $reponse->error = 1;
        $reponse->success = 0;
    } else {
        $give_vote_exists = $response->getUserVoteRecord($file_id, $user_id);
        //echo $give_vote_exists; exit;
        if ($give_vote_exists < 1) {

            $rows = $response->GiveVote($_REQUEST);
            if ($rows) {
                $reponse->message = "vote add successfully.";
                $reponse->error = 0;
                $reponse->success = 1;
            } else {
                $reponse->message = "Problem in adding vote.";
                $reponse->error = 1;
                $reponse->success = 0;
            }
        } else {
            $reponse->message = "Sorry! You have already give vote.";
            $reponse->error = 1;
            $reponse->success = 0;
        }
    }
}
/*
 * NAME         : ApproveFile 
 * Method       : GET 
 * PARAMS       : user_id,tag,api_id,file_id,is_approved
 * URL          : json.php?tag=ApproveFile&app_id=A100DU89544&user_id=1&file_id=asdfga&$is_approved=1 or 0
 * RESPONSE     : message (object),error (object), success (object), data (array)
 * DESCRIPTION  : this api is used approve the file .
 * 
 */ elseif ($tag == "ApproveFile") {

    if (empty($user_id)) {
        $reponse->message = "user_id Not Found.";
        $reponse->error = 1;
        $reponse->success = 0;
    } else if (empty($file_id)) {
        $reponse->message = "file_id  Not Found.";
        $reponse->error = 1;
        $reponse->success = 0;
    } else {

        $user_data = (array) $response->getUserRecords($user_id);

        $user_data = $user_data[0];
        $_REQUEST["user_name"] = $user_data->login_name;
        $rows = $response->ApproveFile($_REQUEST);
        if ($rows) {
            $reponse->message = "Approved add successfully.";
            $reponse->error = 0;
            $reponse->success = 1;
        } else {
            $reponse->message = "Problem in Approving file.";
            $reponse->error = 1;
            $reponse->success = 0;
        }
    }
}


/*
 * NAME         : RenameFile 
 * Method       : POST 
 * PARAMS       : user_id,tag,api_id,file_id,type(note,file),file_name
 * URL          : json.php?tag=RenameFile
 * RESPONSE     : message (object),error (object), success (object), data (array)
 * DESCRIPTION  : this api is used to Rename File 
 */ elseif ($tag == "RenameFile") {


    if (empty($user_id)) {
        $reponse->message = "user_id Not Found.";
        $reponse->error = 1;
        $reponse->success = 0;
    } elseif (empty($file_id)) {
        $reponse->message = "file_id Not Found.";
        $reponse->error = 1;
        $reponse->success = 0;
    } elseif (empty($type)) {
        $reponse->message = "type Not Found";
        $reponse->error = 1;
        $reponse->success = 0;
    } elseif (empty($file_name)) {
        $reponse->message = "File name Not Found.";
        $reponse->error = 1;
        $reponse->success = 0;
    } else {
        $user_data = (array) $response->getUserRecords($user_id);
        $user_data = $user_data[0];
        if (empty($user_data->permissions)) {
            $reponse->message = "You have No Permission to Rename a file.";
            $reponse->error = 1;
            $reponse->success = 0;
        } else {
            $permission_lvl = explode(",", $user_data->permissions);
            if (array_search("Edit", $permission_lvl) == true) {
                if (count($user_data) > 0) {
                    $user = $response->RenameFile($user_id, $file_id, $file_name, $type);
                    //print_r($user); exit;
                    if (!empty($user)) {
                        $reponse->message = "Successfully Rename a file.";
                        $reponse->Data = $user['id'];
                        $reponse->error = 0;
                        $reponse->success = 1;
                    } else {
                        $reponse->message = "Problem in File renaming.";
                        $reponse->error = 1;
                        $reponse->success = 0;
                    }
                } else {
                    $reponse->message = "Invalid User Id.";
                    $reponse->error = 1;
                    $reponse->success = 0;
                }
            } else {
                $reponse->message = "You have No Permission to Rename a file.";
                $reponse->error = 1;
                $reponse->success = 0;
            }
        }
    }
}


/*
 * NAME         : BookMark 
 * Method       : POST 
 * PARAMS       : user_id,tag,api_id,file_id,pageNo,type (Add,Remove)
 * URL          : json.php?tag=BookMark
 * RESPONSE     : message (object),error (object), success (object), data (array)
 * DESCRIPTION  : this api is used to add bookmark file of pages
 */ elseif ($tag == "BookMark") {


    if (empty($user_id)) {
        $reponse->message = "user_id Not Found.";
        $reponse->error = 1;
        $reponse->success = 0;
    } elseif (empty($file_id)) {
        $reponse->message = "file_id Not Found.";
        $reponse->error = 1;
        $reponse->success = 0;
    } elseif (empty($pageNo)) {
        $reponse->message = "pageNo Not Found";
        $reponse->error = 1;
        $reponse->success = 0;
    }

elseif (empty($type)) {
        $reponse->message = "type must be Add or Remove";
        $reponse->error = 1;
        $reponse->success = 0;
    }
     else {
        $user_data = (array) $response->getUserRecords($user_id);
        $user_data = $user_data[0];
        
           
            if (count($user_data) > 0) {

               $file_data = $response->AddDeleteBookMark($user_id,$file_id,$type,$pageNo);
               if ($file_data) {

                    $reponse->message = "Successfully.";
                   $reponse->error = 0;
                    $reponse->success = 1;
                } else {
                    $reponse->message = "Problem in inserting or updating data.";
                    $reponse->error = 1;
                    $reponse->success = 0;
                }
            } else {
                $reponse->message = "Invalid User Id.";
                $reponse->error = 1;
                $reponse->success = 0;
            }
           
        
    }
}




$reponse = (array) $reponse;
echo json_encode($reponse);
?>