$(document).ready(function(){
  $('.deleteUser').on('click', deleteUser);
  $('.updateUser').on('click', updateUser);
});

function deleteUser(){
  var confirmation = confirm('Are you sure?');
  if(confirmation){
    $.ajax({
      type:'DELETE',
      url:'/users/delete/' + $(this).data('id')
    }).done(function(response){
    });
    window.location.replace('/');
  } else{
    return false;
  }
};

function updateUser(){
  var confirmation = confirm('Confirm Update?');
  if(confirmation){
    var $form = $( "#user_form" ),
      first_name = $form.find( "input[name='first_name']" ).val(),
      last_name = $form.find( "input[name='last_name']" ).val(),
      email = $form.find( "input[name='email']" ).val(),
      url = '/users/update/' + $(this).data('id');

      // Send the data using post
      $.post( url, { first_name: first_name, last_name: last_name, email:email } ).done(function(response){
      window.location.replace('/');
    });
  }
}
