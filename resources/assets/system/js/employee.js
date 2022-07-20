import {error} from "./toast-partials";

$(function(){
    if($('#company_name').length > 0){
        var companyId = $('#company_name').find(":selected").val().trim();
        
        if(companyId){
            
            let url = '/employee-master/get/departments';
            let selectedDepartment  = $('input[name="selected_department_id"]').val();
            $.ajax({
                url,
                type: 'get',
                data: {
                    companyId: companyId
                },
                success: (data) =>{
                    if(data.length>0){
                        
                        $.each(data, function(key, value) {
                            if(value.childDepartment.length>0){
                                let option = '<option></option>';
                                if(selectedDepartment !== "" && parseInt(selectedDepartment) === parseInt(value.id)){
                                    option = '<option selected></option>';
                                }
                                $('#department_name').append($(option).attr("value", value.id).text(value.department_name));
                                $.each(value.childDepartment, function(key, value){  

                                    if(value.status){
                                        let option2 = '<option></option>';
                                        if(selectedDepartment !== "" && parseInt(selectedDepartment) === parseInt(value.id)){
                                            option2 = '<option selected></option>';
                                        }
                                        $('#department_name').append($(option2).attr("value", value.id).text("-- " + value.department_name));
                                                    
                                    } 
                                    
                                })
                            }else{
                                let option3 = '<option></option>';
                                if(selectedDepartment !== "" && parseInt(selectedDepartment) === parseInt(value.id)){
                                    option3 = '<option selected></option>';
                                }
                                $('#department_name').append($(option3).attr("value", value.id).text(value.department_name));
                            }

                        });
                    }else{
                        $('#department_name').val('');
                        $('#department_name').removeAttr("readonly");  
                    }
                },
                error: (e) => {
                    error();
                }
            })
    
        }
    
    }
    $('#company_name').on("change", function(){
        $('#department_name').empty();
        $('#department_name').append('');
        let url = '/employee-master/get/departments';
        $.ajax({
            url,
            type: 'get',
            data: {
                companyId: $(this).val()
            },
            success: (data) =>{
                if(data.length>0){

                    $.each(data, function(key, value) {
                        
                        
                        if(value.childDepartment.length>0){
                            $('#department_name').append(`<option class="optionGroup" style="font-weight: bold;"  value= "${value.id}" >${value.department_name}  </option>`)
                            $.each(value.childDepartment, function(key, value){  
                                if(value.status){
                                    $('#department_name').append(`<option class="optionChild"  value= "${value.id}"> -- ${value.department_name} </option>`)                              
                                }    
                            })
                        }else{

                            $('#department_name').append(`<option class="optionChild" value= "${value.id}"> ${value.department_name} </option>`)
                        }

                    });
                }else{
                    $('#department_name').val('');
                    $('#department_name').removeAttr("readonly");  
                }
            },
            error: (e) => {
                error();
            }
        })

    });

    $('input[name="family_name"],input[name="first_name"]').on("input", function(){
        $('input[name="employee_name"]').val( $('input[name="family_name"]').val()+' '+ $('input[name="first_name"]').val());
    });
    mainEditForm.init();
    multipleDepartmentDelete.init();
});

const mainEditForm = (function(){
    const employeeEditForm = $('.employeeEditForm');
    const button =  $('.submitEmployeeEditForm')
    const init = () => {
        registerEvents();
    };

    const registerEvents = () => {
        button.on("click", handleSubmit)
    }

    const handleSubmit = function(){
        if(!employeeEditForm[0].checkValidity()){
            employeeEditForm[0].reportValidity()
            return false;
        }
        employeeEditForm.submit();
    }

    return {
        init
    }
})()


const multipleDepartmentDelete = (function () {
    const departmentDeleteButton = $(".deleteDepartment");
    const init = () => {
      registerEvents();
    };
  
    const registerEvents = () => {
        departmentDeleteButton.on("click", handleConfirm);
    };
    const handleConfirm = () => {
      const form = $("#multipleDepartmentDelete");
      const textBody = "Are you Sure to Remove Selected Departments ?";
      confirmAlert(form, textBody);
    };
    return {
      init,
    };
  })();
  const confirmAlert = (form, textBody) => {
    Swal.fire({
      text: textBody,
      showCancelButton: true,
      confirmButtonColor: "#6259ca",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        form.submit();
      } else {
        return false;
      }
    });
  };
  