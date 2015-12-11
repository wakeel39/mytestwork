<?php

include ((__DIR__) . "/classes/database.php");
//include((__DIR__) . "/classes/googledriveclass.php");
include "classes/googledriveclass.php";
include "classes/push_apns.php";

class Base {

    var $success;
    var $message;
    var $error;
    var $Data;
    var $push_type = "dis";

    /*
     * get user folder based on user folders
     */

    function GetUserFolder($folder_id) {
        global $Drive, $service;
        $folders = array();
        $files = $Drive->getResult($service, $folder_id);
        foreach ($files["items"] as $f) {

            $folders[$f['id']] = $f;
        }

        $list = array();
        $childs = array();

        foreach ($folders as $folder) {
            $a = array();
            //مساحة العمل
            $a['id'] = $folder["id"];
            $a['name'] = $folder["title"];
            if ($folder['title'] == 'ملاحظات') {
                $user_files = $this->getNotesChildsByFolderID($folder["id"], $_REQUEST['user_id']);
            } else {
                $user_files = $this->getFilesByFolderID($folder["id"]);
            }

            if ($folder["mimeType"] == 'application/vnd.google-apps.folder') {
                $a['isFolder'] = 1;
            } else {
                $a["isFolder"] = 0;

            }
            if (count($user_files) > 0) {
                $a["havechilds"] = 1;
                $a["childs"] = $user_files;
            } else {
                $a["havechilds"] = 0;
            }
        
            $list[] = $a;
        }
        $wdata = $this->GetWorkspacefolder($_REQUEST['user_id']);
        $workspace = array();
        $workspace["id"]="";
        $workspace["name"]="مساحة العمل";
        $workspace["isFolder"]=1;

        if(count($wdata)) {  $havechilds = 1; 
            $workspace["childs"]=$wdata;

        } else { $havechilds = 0;


         }
         $workspace["havechilds"]=$havechilds;
       
        $list[]  = $workspace;
        return $list;
    }



/*
*get workspace files
*/

function GetWorkspacefolder($user_id) {
        global $DataBase;
        $folders = array();
        //SELECT * FROM `share_workspace_with_user` WHERE commite_id in ((select group_id from wp_groups_users where user_id = '1')) or user_id = '1'
        $cond = "commite_id in ((select group_id from wp_groups_users where user_id = '$user_id')) or user_id = '$user_id'";
        $workspace_list = $DataBase->Select_Rows("*", "share_workspace_with_user", $cond);
       
        $list = array();
        $childs = array();

        foreach ($workspace_list as $work) {
            $a = array();

            $a['id'] = $work->file_id;
            $a['name'] = $work->file_name;
            $a['isFolder'] = $work->isFolder;
            if ($work->isFolder == '1') {
                $workspacechilds = $this->getWorkspaceChildsByFolderID($work->file_id,$user_id);
                if(count($workspacechilds) > 0) { 
                     $a["havechilds"] = 1;
                 $a["childs"] = $workspacechilds;
                }else {
                    $a["havechilds"] = 0;
                }
               
            } else {
                $file_id = $work->file_id;
                $cond = "file_parent_id = '$file_id' and user_id = '$user_id'";
                $original = $DataBase->Select_Rows("*", "edit_workspace_files", $cond); 
                
                $a["downloadlink"]= $work->downloadlink;
                $a["orignal_file"]= "";
                if(count($original) > 0) { 
                    $original =$original[0];
                    $a["downloadlink"]= $original->downloadlink;
                    $a["orignal_file"]= $work->downloadlink;
                }
                
                $a["havechilds"] = 0;
            }

           $list[] = $a;
        }

        return $list;
}

/*
*edit workspace file
*/

function EditWorkspaceFile($user_id, $file_parent_id, $data) {
        global $Drive, $service, $DataBase;
        
        $cond = "folder_id = '$file_parent_id'";
        $file_detials = $DataBase->Select_Row("*", "workspaces", $cond);

        $cond = "user_id = '$user_id' and file_id ='$file_parent_id'";
        $rows =$DataBase->Delete_Rows("workspaces", $cond);

        $user = $this->getUserRecords($user_id);

        $folder_id = $user[0]->share_folder_id;
      
        if(!empty($folder_id) && !empty($file_parent_id) ) { 

            $file_id = $Drive->CreateFile($service, $folder_id, $data);

            if (!empty($file_id["id"])) {
                    $fields = array();
                    $fields['user_id'] = $user_id;
                    $fields['file_id'] = $file_id["id"];
                    $fields['file_parent_id'] = $file_parent_id;
                    $fields['file_name'] = $file_id["title"];
                    $fields['isFolder'] = 0;
                    $fields['downloadlink'] = $file_id["webContentLink"];
                    $DataBase->Add_Rows("edit_workspace_files",$fields);
                       
                }

        }
    
        return $file_id;
    }


/*
*get workspace childs folder and  files
*/

function getWorkspaceChildsByFolderID($folder_id,$user_id) {
        global $DataBase;
        
        $cond = "parent_id = '$folder_id'";
        $workspace_list = $DataBase->Select_Rows("*", "workspaces", $cond);
        
        $list = array();
        $childs = array();

        foreach ($workspace_list as $work) {
            $a = array();

            
           
            $a['isFolder'] = $work->is_folder;
            if ($work->is_folder == '1') {
                $workspacechilds = $this->getWorkspaceChildsByFolderID($work->folder_id,$user_id);
                if(count($workspacechilds) > 0) { 
                        $a['id'] = $work->folder_id;
                      $a['name'] = $work->name;
                      $a["havechilds"] = 1;
                     $a["childs"] = $workspacechilds;
                     
                }else {
                    
                    $a["havechilds"] = 0;
                }
               
            } else {
                $file_id = $work->folder_id;
                $cond = "file_parent_id = '$file_id' and user_id = '$user_id'";
                $original = $DataBase->Select_Rows("*", "edit_workspace_files", $cond); 
                $a['file_id'] = $work->folder_id;
                    $a['file_name'] = $work->name;
                $a["downloadlink"]= $work->file_link;
                $a["orignal_file"]= "";
                if(count($original) > 0) { 
                    $original =$original[0];
                    $a["downloadlink"]= $original->downloadlink;
                    $a["orignal_file"]= $work->file_link;
                }
                // $a["havechilds"] = 0;
            }

           $list[] = $a;
        }

        return $list;
}




    /*
     * check user in present db 
     */

    function getUserRecords($user_id) {
        global $DataBase;
        $cond = "ID = '$user_id'";
        $USER = $DataBase->Select_Rows("*", "wp_users", $cond);
        return $USER;
    }

    /*
     * check Multiple user in present db 
     */

    function getMultipleUserRecords($user_id) {
        global $DataBase;
        $cond = "ID IN( $user_id )";
        $USER = $DataBase->Select_Rows("*", "wp_users", $cond);
        return $USER;
    }

    function getFilesByFolderID($folder_id) {
        global $DataBase;
        $cond = "file_parent_id = '$folder_id'";
        $files = $DataBase->Select_Rows(array("file_id", "isFolder", "file_name", "downloadlink", "orignal_file_download_link as orignal_file"), "users_files", $cond);
        if (count($files) > 0) {
            foreach ($files as $key => $file) {
                $file->bookmark = $this->getFileBookMarkPages($_REQUEST['user_id'],$file->file_id);
                $file->file_name = urldecode($file->file_name);
            }
        }
        return $files;
    }

    function getNotesChildsByFolderID($folder_id, $sender_id) {
        global $DataBase;
        $cond = "file_parent_id = '$folder_id'";
        $files = $DataBase->Select_Rows(array("file_id", "isFolder", "file_name", "downloadlink", "orignal_file_download_link as orignal_file"), "notes", $cond);

        foreach ($files as $file) {
            $cond = "parentFile_id='".$file->file_id."' AND user_id='".$sender_id."' ";
            $edited_notes = $DataBase->Select_Row(array("orignal_file_download_link"),"edited_notes",$cond);
           
             $file->bookmark =  $this->getFileBookMarkPages($sender_id,$file->file_id);

            $file->orignal_file=$edited_notes->orignal_file_download_link;
            If(empty($file->orignal_file)) { $file->orignal_file =""; }
            $file->CanEdit = 1;
            $file->file_name = urldecode($file->file_name);
            $file->is_voted = 0;
            $file->ForVote = 0;
        }
        $files_shares = $DataBase->Select_Rows(array("notes.file_id", "notes_share_files.user_id", "notes.share_type  as ForVote", "notes_share_files.is_approved as is_voted", "isFolder", "file_name", "downloadlink", "orignal_file_download_link as orignal_file"), "notes_share_files,notes", "sender_id='$sender_id'  and notes.file_id=notes_share_files.file_id");

        foreach ($files_shares as $file_s) {
            $file_s->CanEdit = 1;

            $cond = "parentFile_id='".$file_s->file_id."' AND user_id='".$sender_id."' ";
            $edited_notes = $DataBase->Select_Row(array("orignal_file_download_link"),"edited_notes",$cond);
            $file_s->orignal_file=$edited_notes->orignal_file_download_link;
             If(empty($file->orignal_file)) { $file->orignal_file =""; }
             $file_s->bookmark =  $this->getFileBookMarkPages($sender_id,$file_s->file_id);

            $file_s->file_name = urldecode($file_s->file_name);
            //sender information
            $cond_sender = "ID = '$file_s->user_id'";
            $senderdetials = $DataBase->Select_Row(array("user_email", "display_name as name"), "wp_users", $cond_sender);
            //end sender information

            $file_s->senderDetail = $senderdetials;
            if ($file_s->ForVote == "") {
                $file_s->ForVote = 1;
                $file_s->TotalUpVotes = $DataBase->Num_Rows("*", "notes_share_files", "file_id='$file_s->file_id' and is_approved='1'");
                $file_s->TotalDownVotes = $DataBase->Num_Rows("*", "notes_share_files", "file_id='$file_s->file_id' and is_approved='2'");
            } else {
                $file_s->ForVote = 0;
            }
        }
        $files = array_merge($files, $files_shares);
        return $files;
    }

    function CreateFolder($user_id, $parent_id = '', $folder_name) {
        global $Drive, $service;
        $folder_id = $Drive->CreateFolder($service, $parent_id, $folder_name);

        return $folder_id;
    }

    function UploadFile($user_id, $folder_id, $data) {
        global $Drive, $service, $DataBase;

        $file_id = $Drive->CreateFile($service, $folder_id, $data);
        if (!empty($file_id["id"])) {
            $table = "users_files";
            $fields = array();
            $fields["file_id"] = $file_id["id"];
            $fields["user_id"] = $user_id;
            $fields["file_parent_id"] = $folder_id;
            $fields["file_name"] = $file_id["title"];
            $fields["downloadlink"] = $file_id["webContentLink"];
            $USER = $DataBase->Add_Rows($table, $fields);
        }
        return $file_id;
    }

    function UploadFileFromLink($user_id, $folder_id, $file_link) {
        global $Drive, $service, $DataBase;

        $file_id = $Drive->CreateFileFromLink($service, $folder_id, $file_link);
        if (!empty($file_id["id"])) {
            $table = "users_files";
            $fields = array();
            $fields["file_id"] = $file_id["id"];
            $fields["user_id"] = $user_id;
            $fields["file_parent_id"] = $folder_id;
            $fields["file_name"] = $file_id["title"];
            $fields["downloadlink"] =urldecode($file_link);
            $fields["file_link"] = $file_link;
            $fields["is_opend_file"] = 1;
            $USER = $DataBase->Add_Rows($table, $fields);
        }
        return $file_id;
    }

    function CreateNote($user_id, $share_folder_id, $data) {
        global $Drive, $service, $DataBase;

        $file_id = $Drive->CreateFile($service, $share_folder_id, $data);
        $file_idd = $file_id['id'];
        if (count($file_id) > 0) {
            $table = "notes";
            $fields = array();
            $fields["file_id"] = $file_id["id"];
            $fields["user_id"] = $user_id;
            $fields["file_parent_id"] = $share_folder_id;
            $fields["file_name"] = $file_id["title"];
            $fields["downloadlink"] = $file_id["webContentLink"];
            $USER = $DataBase->Add_Rows($table, $fields);
        }
       

        return $file_id;
    }

    function GetNoteDetail($file_id,$user_id)
    {
         global $Drive, $service, $DataBase;

         $cond = "file_id = '$file_id' and user_id = '$user_id'";
        $file_detials = $DataBase->Select_Row(array('file_id','file_name','downloadlink' ), "notes", $cond);

        $file_detials->file_id = $file_detials->file_id;
        $file_detials->file_name = $file_detials->file_name;
        $file_detials->downloadlink = $file_detials->downloadlink;
        $file_detials->isFolder = "0";
        $file_detials->orignal_file = "";

        $file_detials->CanEdit = 0;
        $file_detials->is_voted = 0;
        if($_REQUEST['type'] == "for_approval") { 
            $file_detials->ForVote = 0;
        }
        return $file_detials;

    }

    function CheckFileLink($file_link,$user_id) {
        global $Drive, $service, $DataBase;
        $cond = "file_link = '$file_link' and user_id = '$user_id' and is_opend_file='1'";
        $file_detials = $DataBase->Select_Row("*", "users_files", $cond); 
        return $file_detials;
    }

    function EditFile($user_id, $file_id, $data) {
        global $Drive, $service, $DataBase;
        $cond = "file_id = '$file_id'";
        $file_detials = $DataBase->Select_Row("*", "users_files", $cond);
        $folder_id = $file_detials->file_parent_id;
        if (!empty($file_detials->orignal_file_id)) {
            $Drive->deleteFile($service, $file_detials->orignal_file_id);
        }
        $copyfile = $Drive->copyFile($service, $folder_id, $file_id, $title);
        //print_r($copyfile); exit;
        if (!empty($copyfile["id"])) {
            $table = "users_files";
            $cond = "file_id = '" . $file_id . "'";
            $fields = array();
            $fields["orignal_file_id"] = $copyfile["webContentLink"];
            $fields["orignal_file_name"] = $copyfile["title"];
            $fields["orignal_file_download_link"] = $copyfile["webContentLink"];
            $USER = $DataBase->Update_Rows($table, $fields, $cond);
        }
        $file_id = $Drive->UpdateFile($service, $file_id, $data);
        if (!empty($file_id["id"])) {
            $table = "users_files";
            $cond = "file_id = '" . $file_id . "'";
            $fields = array();

            $fields["file_name"] = $file_id["title"];
            $fields["downloadlink"] = $file_id["webContentLink"];
            $USER = $DataBase->Update_Rows($table, $fields, $cond);
        }
        return $file_id;
    }

    function EditNote($user_id, $file_id, $data) {
        global $Drive, $service, $DataBase;
        $cond = "file_id = '$file_id'";
        $file_detials = $DataBase->Select_Row("*", "notes", $cond); 

        $folder_id = $file_detials->file_parent_id;

        $cond = "file_id = '$file_id'  AND user_id = '$user_id'";
        $edited_notes = $DataBase->Select_Row("*", "edited_notes", $cond);


        if (is_object($edited_notes) && !empty($edited_notes->orignal_file_id)) {
            $Drive->deleteFile($service, $edited_notes->orignal_file_id);
            
        }

        $cond = "file_id = '$file_id'  AND user_id = '$user_id'";
         $DataBase->Delete_Rows("edited_notes", $cond);
        
        $copyfile =$Drive->CreateFile($service, $folder_id, $data);
        //print_r($copyfile);
        
        if (!empty($copyfile["id"])) {
            $table = "edited_notes";
            $fields = array();
            $fields["orignal_file_id"] = $file_detials->file_id;
            $fields["parentFile_id"] = $copyfile["id"];
            $fields["orignal_file_name"] = $file_detials->file_name;
            $fields["user_id"] = $user_id;
            $fields["orignal_file_download_link"] =  $file_detials->downloadlink;
            $USER = $DataBase->Add_Rows($table, $fields);


            $table = "notes";
            $cond = "file_id = '" . $file_detials->file_id . "'";
            $fields = array();

            $fields["file_id"] = $copyfile["id"];
            $fields["file_name"] = $copyfile["title"] ;
            $fields["downloadlink"] =  $copyfile["webContentLink"];
            $USER = $DataBase->Update_Rows($table, $fields, $cond);

        }
       /* $file_id = $Drive->UpdateFile($service, $file_id, $data);
        if (!empty($file_id["id"])) {
            $table = "notes";
            $cond = "file_id = '" . $file_id["id"] . "'";
            $fields = array();

            $fields["file_name"] = $file_id["title"];
            $fields["downloadlink"] = $file_id["webContentLink"];
            $USER = $DataBase->Update_Rows($table, $fields, $cond);
        }*/
        $files =array();
        $files["file_id"] = $copyfile["id"];
        $files["file_name"] = $copyfile["title"] ;
        $files["downloadlink"] =  $copyfile["webContentLink"];
        return $files;
    }

    function UpdateUserData($user_id, $fields) {
        global $DataBase;
        $cond = "ID = '$user_id'";
        $table = "wp_users";
        $USER = $DataBase->Update_Rows($table, $fields, $cond);
        return $USER;
    }

    function RenameFile($user_id, $file_id, $filename, $type) {
        global $Drive, $service, $DataBase;

        if ($type == 'note') {
            $table = "notes";
        } else {
            $table = "users_files";
        }
        $cond = "file_id = '$file_id' and user_id = '$user_id'";
        $file_detials = $DataBase->Select_Row("*", $table, $cond);

        if ($file_detials->id > 0) {
            $file_id = $Drive->renameFile($service, $file_id, $filename);
            if (!empty($file_id["id"])) {
                $fields = array();
                $fields["file_name"] = $filename;
                $DataBase->Update_Rows($table, $fields, $cond);
            }
        }
        return $file_id;
    }

    function ShareDoc($type, $data) {
        //global ;
        global $DataBase, $Drive, $service;
        $folders = array();
        //$files = 
        extract($data);
        $copyfile = $Drive->copyFile($service, $folder_id, $file_id, $title);
        $table = "users_files";
        if ($type == "commite") {
            $table2 = "groups_files";
            $fields = array();
            $fields["file_id"] = $copyfile["id"];
            $fields["user_id"] = $sender_id;
            $fields["file_parent_id"] = $folder_id;
            $fields["file_name"] = $title;
            $fields["downloadlink"] = $copyfile["webContentLink"];
            $DataBase->Add_Rows($table2, $fields);
        }
        
        $fields = array();
        $fields["file_id"] = $copyfile["id"];
        $fields["user_id"] = $sender_id;
        $fields["file_parent_id"] = $folder_id;
        $fields["file_name"] = $title;
        $fields["downloadlink"] = $copyfile["webContentLink"];
        $DataBase->Add_Rows($table, $fields);

        /* Send notificaiton start */
        $Push_APNS = new Push_APNS();
        $Push_APNS->set_pushStatus($this->push_type);
        $registatoin_id = $reg_id;
        $message = array();
       // $message['Message'] = "$sender_name share a file with you";
       // $message['Alert'] = "Shared Document Notification";
        $message['Message'] = "$sender_name ملف مشترك من ";
		$message['Alert'] = "تنبيه ملف مشترك";
        $Push_APNS->send_notification($registatoin_id, $message);
        /* Send notificaiton end */
    }

    function ShareNote($type, $data) {
        global $DataBase, $Drive, $service;
        // $folders = array();
        //print_r($data); exit;
        extract($data);
        if ($type == "for_approval") {
            $table = "notes";
            $cond = "file_id = '" . $file_id . "'";
            $fields = array();
            $fields["share_type"] = $type;
            $USER = $DataBase->Update_Rows($table, $fields, $cond);
        }

        $cond_ceck = "file_id ='$file_id' and sender_id = '$sender_id'";
        $check_share_notes = $DataBase->Num_Rows("*", "notes_share_files", $cond_ceck);

        if ($check_share_notes == '0') {
            $table = "notes_share_files";
            $fields = array();
            $fields["file_id"] = $file_id;
            $fields["sender_id"] = $sender_id;
            $fields["user_id"] = $user_id;
            $DataBase->Add_Rows($table, $fields);

            /* Send notificaiton start */
            $Push_APNS = new Push_APNS();
            $Push_APNS->set_pushStatus($this->push_type);
            $registatoin_id = $reg_id;
            $message = array();
            //$message['Message'] = "$sender_name share a file with you";
            //$message['Alert'] = "Shared Note Notification";
            
            $message['Message'] = "$sender_name ملف مشترك من";
            $message['Alert'] = "نبيه ملاحظة مشتركة";
            $Push_APNS->send_notification($registatoin_id, $message);
            /* Send notificaiton end */
        }
       // return true;
    }

    function getFileRecords($file_id) {
        global $DataBase;
        $cond = "file_id = '$file_id'";
        $USER = $DataBase->Select_Row("*", "users_files", $cond);
        return $USER;
    }


    function AddDeleteBookMark($user_id,$file_id,$type,$pageNo) {
        global $DataBase;
        if($type == 'Add'){
            $cond = "user_id = '$user_id' and file_id = '$file_id'";
            $USER = $DataBase->Select_Row("*", "bookmarks_filepages", $cond);
          
            if(is_object($USER)) { 
               
                if(!empty($USER->page_string)) {
                    $page_string =  explode(",", $USER->page_string);
                    $page_string[] = $pageNo;
                    $page_string= array_unique($page_string);
                    $newpagestring = implode(",", $page_string);

                     $cond="user_id = '$user_id' and file_id = '$file_id' ";
                    $fields = array();
                    $fields["user_id"] = $user_id;
                    $fields["file_id"] = $file_id;
                    $fields["page_string"] = $newpagestring;
                    //echo $DataBase->Add_Rows("bookmarks_filepages",$fields,"yes"); exit;
                    $DataBase->Update_Rows("bookmarks_filepages",$fields,$cond); 
                } 
                else {
                     $page_string=array();
                    $page_string[] = $pageNo;
                    $page_string= array_unique($page_string);
                    $newpagestring = implode(",", $page_string);
                   
                    $fields = array();
                    $fields["user_id"] = $user_id;
                    $fields["file_id"] = $file_id;
                    $fields["page_string"] = $newpagestring;
                   // echo $DataBase->Update_Rows("bookmarks_filepages",$fields,$cond,"yes"); exit;
                   $DataBase->Add_Rows("bookmarks_filepages",$fields); 


                }
                
            }
            else {

                    $page_string=array();
                    $page_string[] = $pageNo;
                    $page_string= array_unique($page_string);
                    $newpagestring = implode(",", $page_string);
                   
                    $fields = array();
                    $fields["user_id"] = $user_id;
                    $fields["file_id"] = $file_id;
                    $fields["page_string"] = $newpagestring;
                   // echo $DataBase->Update_Rows("bookmarks_filepages",$fields,$cond,"yes"); exit;
                   $DataBase->Add_Rows("bookmarks_filepages",$fields); 
                }
        }
        if($type == 'Remove'){
            $cond = "user_id = '$user_id' and file_id = '$file_id'";
            $USER = $DataBase->Select_Row("*", "bookmarks_filepages", $cond);
            if(is_object($USER)) { 
            $page_string =  explode(",", $USER->page_string);
            if(($key = array_search($pageNo, $page_string)) !== false) {
                    unset($page_string[$key]);
                    $newpagestring = implode(",", $page_string);
                    $cond="user_id = '$user_id' and file_id = '$file_id' ";
                    $fields = array();
                    $fields["user_id"] = $user_id;
                    $fields["file_id"] = $file_id;
                    $fields["page_string"] = $newpagestring;
                    $DataBase->Update_Rows("bookmarks_filepages",$fields,$cond);
                }
            }
        }
       return 1;
    }

    function getNoteRecords($file_id) {
        global $DataBase;
        $cond = "file_id = '$file_id'";
        $USER = $DataBase->Select_Row("*", "notes", $cond);
        return $USER;
    }

    function getChairManID($group_id) {
        global $DataBase;
        $cond = "id = '$group_id'";
        $USER = $DataBase->Select_Row("*", "wp_groups", $cond);
        return $USER->chairmain_id;
    }

    function getGroupsUsers($group_id) {
        global $DataBase;
        $cond = "group_id = '$group_id'";
        $USER = $DataBase->Select_Rows("*", "wp_groups_users", $cond);
        return $USER;
    }

    function getMultipleGroupsUsers($group_id) {
        global $DataBase;
        $cond = "group_id IN( $group_id )";
        $USER = $DataBase->Select_Rows(array("distinct(user_id) as user_id", "wp_groups_users.*"), "wp_groups_users", $cond, "", "user_id");
        return $USER;
    }

    function getAllUsers() {
        global $DataBase;
        $USER = $DataBase->Select_Rows("*", "wp_users");
        return $USER;
    }
	
	function getAllAssignUsers($user_id) {
        global $DataBase;
        $USER = $DataBase->Select_Rows(array("wp_users.*"), "wp_users WHERE ID in (SELECT share_with_user_id FROM wp_shareuserpermissions where user_id = '$user_id')");
         if(count($USER) > 0) { return $USER; }
		else  { 
$USER = $DataBase->Select_Rows(array("wp_users.*"), "wp_users WHERE ID='$user_id' UNION select ID,display_name,user_email from wp_users where ID != '$user_id'");
 return $USER; }
    }

    function getUsers($user_id) {
		global $DataBase;
       $USER = $DataBase->Select_Rows(array("ID", "display_name as name", "user_email"), "wp_users WHERE ID in (SELECT share_with_user_id FROM wp_shareuserpermissions where user_id = '$user_id')");
         if(count($USER) > 0) { return $USER; }
else  { 
$USER = $DataBase->Select_Rows(array("ID", "display_name as name", "user_email"), "wp_users WHERE ID='$user_id' UNION select ID,display_name,user_email from wp_users where ID != '$user_id'");
 return $USER; }
    }

    function getFileBookMarkPages($user_id,$file_id) {
        global $DataBase;
        $cond = "file_id = '$file_id' and user_id = '$user_id' ";
        $user= $DataBase->Select_Row(array("page_string"), "bookmarks_filepages", $cond);
        if(empty($user->page_string)) { $bookmark = ""; } else { $bookmark = $user->page_string; } 
        return $bookmark;   
    }

    function getCommites() {
        global $DataBase;
        $c = array();
        $groups = $DataBase->Select_Rows(array("id", "name"), "wp_groups");
        foreach ($groups as $key => $group) {
            $c[$key]["id"] = $group->id;
            $c[$key]["name"] = $group->name;
            $c[$key]["users"] = $this->getGroupUser($group->id);
        }
        return $c;
    }

    function getGroupUser($group_id) {
        global $DataBase;
        $USER = $DataBase->Fetch_Query("SELECT u.id,u.display_name as name,u.user_email FROM wp_groups_users as u_g LEFT JOIN wp_users AS u ON(u.ID = u_g.user_id) where u_g.group_id = '$group_id' ");
        return $USER;
    }

    function UpdateRegID($user_id, $regID) {
        global $DataBase;
        $cond = "ID = '$user_id'";
        $fields = array();
        $fields["regID"] = $regID;
        $table = "wp_users";
        $USER = $DataBase->Update_Rows($table, $fields, $cond);
        if ($USER) {
            return 1;
        } else {
            return 0;
        }
    }

    function getUserVoteRecord($file_id, $user_id) {
        global $DataBase;
        $cond = "file_id = '$file_id' and user_id = '$user_id' and is_approved='1'";
        $USER = $DataBase->Num_Rows("*", "notes_share_files", $cond);
        return $USER;
    }

    function GiveVote($data) {
        global $DataBase;
        extract($data);
        $cond = "user_id = '$user_id' and file_id='$file_id'";
        $fields = array();
        $fields["is_approved"] = $is_approved;
        $table = "notes_share_files";
        $USER = $DataBase->Update_Rows($table, $fields, $cond);
        //votes count
        $cond = "file_id ='$file_id' and is_approved='1'";
        $total_votes = $DataBase->Num_Rows("*", "notes_share_files", $cond);
        if ($total_votes > 2) {
            $table = "notes_share_files";
            $fields = array();
            $fields["file_id"] = $file_id;
            $fields["sender_id"] = $chairmain_id;
            $fields["share_type"] = "for_approval";
            $DataBase->Add_Rows($table, $fields);
            /* Send notificaiton start */
            $Push_APNS = new Push_APNS();
            $Push_APNS->set_pushStatus($this->push_type);
            $files_detail = $this->getNoteRecords($file_id);
            $user_data = (array) $this->getUserRecords($files_detail > user_id);
            $user_data = $user_data[0];
            $registatoin_id = $user_data->regID;
            $message = array();
            $message['Message'] = "$user_data->login_name share a file with you";
            $message['Alert'] = "Shared Note Notification";
            $Push_APNS->send_notification($registatoin_id, $message);
            /* Send notificaiton end */
        }


        if ($USER) {
            return 1;
        } else {
            return 0;
        }
    }

    function ApproveFile($data) {
        global $DataBase;
        extract($data);
        $cond = "file_id='$file_id'";
        $fields = array();
        $fields["is_approved"] = $is_approved;
        $table = "notes";
        $USER = $DataBase->Update_Rows($table, $fields, $cond);

        /* Send notificaiton start */
        $Push_APNS = new Push_APNS();
        $Push_APNS->set_pushStatus($this->push_type);
        $files_detail = $this->getNoteRecords($file_id);
        $user_data = (array) $this->getUserRecords($files_detail > user_id);
        $user_data = $user_data[0];
        $registatoin_id = $user_data->regID;
        $message = array();
        $message['Message'] = "$user_name Approved your file";
        $message['Alert'] = "Shared Note Notification";
        $Push_APNS->send_notification($registatoin_id, $message);
        /* Send notificaiton end */



        if ($USER) {
            return 1;
        } else {
            return 0;
        }
    }

    function AddHelpReq($user_id) {
        global $DataBase;
        $fields = array();
        $fields["userid"] = $user_id;
        $table = "wp_help";
        $USER = $DataBase->Add_Rows($table, $fields);
        if ($USER) {
            return 1;
        } else {
            return 0;
        }
    }

}

$response = new Base();
?>