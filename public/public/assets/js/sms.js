$(function () {
    var $recipient_list = $('#recipient'),
        $msg = $('#msg'),
        $msgprev = $('#previewMsg'),
        $curContact = $('#currentContact'),
        $msg_counter = $('#msg_counter'),
        $btnsend = $('#btnsend'),
        $btnfields = $('#btnfields'),
        $field_list = $('#fields'),
        $btnaddrecipient = $('#btnadd_list'),
        $btndelete_list = $('#btndelete_list'),
        $fname = $('#fname'),
        $lname = $('#lname'),
        $tel = $('#tel'),
        $pos = $('#pos');

    loadContacts();

    function loadContacts() {
        $recipient_list.html("");
        for (var i = 0; i < contacts.length; i++) {
            $recipient_list.append(
                $('<option></option>').addClass("contact-list").attr('data-content', JSON.stringify(contacts[i])).attr("value", i).text(' - ' + contacts[i].fname + ' ' + contacts[i].lname)
            );
        }

        $('.contact-list').off('dblclick').on('dblclick', function () {
            var $this = $(this);
            $btndelete_list.attr('data-cindex', $this.val());
            $('#delrecipientModal').find('h5').find('span').html(contacts[$this.val()].fname + ' ' + contacts[$this.val()].lname);
            $('#delrecipientModal').modal('show');
        });

        $msgprev.html(replaceFields(contacts[0]));
    }

    loadFields();

    function loadFields() {
        $field_list.html("");
        for (var key in fields) {
            $field_list.append(
                $('<li></li>').attr('data-content', fields[key]).html(
                    $('<a></a>').attr("href", "javascript:void(0)").attr('data-content', key).html(key)
                )
            );
        }
        $field_list.find('li').find('a').on('click', function () {
            var caretPos = document.getElementById("msg").selectionStart;
            var txtToAdd = '<' + $(this).data('content') + '>';
            $msg.val($msg.val().substring(0, caretPos) + txtToAdd + $msg.val().substring(caretPos));
            $msg.trigger('change');
            $$msgprev.html(replaceFields(contacts[0]));
        });
    }

    $btnaddrecipient.on('click', function (e) {
        if ($fname.val() == '' || $lname.val() == '' || $tel.val() == '' || $pos.val() == '') {
            alert('Please fill in the blank fields.');
        } else {
            contacts.push({
                fname: $fname.val(),
                lname: $lname.val(),
                tel: $tel.val(),
                position: $pos.val()
            });
            loadContacts();
            $fname.val("");
            $lname.val("");
            $tel.val("");
            $pos.val("");
            $('#addrecipientModal').modal('hide');
        }
    });


    $btndelete_list.on('click', function () {
        contacts.splice($(this).attr('data-cindex'), 1);
        $('#delrecipientModal').modal('hide');
        loadContacts();
    });

    $msg.on('change keyup paste input', function (e) {
        var count = $(this).val().length;
        var max = 420;
        $msg_counter.html((max - count) + ' Characters left (Message Count ' + (Math.ceil(count / 160)) + ')');
        $msgprev.html(replaceFields(contacts[0]));
    });
    $msg.trigger('change');

    $btnsend.on('click', function () {
        var $this = $(this);
        for (var i = 0; i < contacts.length; i++) {
            var msg = replaceFields(contacts[i]);
            $.ajax({
                url: 'qnxsender/public/sender',
                type: 'POST',
                dataType: 'json',
                data: {
                    message: msg,
                    to: contacts[i].tel
                },
                success: function (data, status, xhr) {
                    alert(JSON.stringify(data));
                    console.log(JSON.stringify(data));
                },
                error: function (xhr, status, error) {
                    alert(JSON.stringify(xhr));
                    console.log(JSON.stringify(xhr));
                }
            });
        }
    });

    function replaceFields(contact) {
        var msg = $msg.val();
        msg = msg.replace(/<ufname>/g, contact.fname);
        msg = msg.replace(/<ulname>/g, contact.lname);
        msg = msg.replace(/<utel>/g, contact.tel);
        msg = msg.replace(/<uposition>/g, contact.position);
        msg = msg.replace(/<afname>/g, fields.afname);
        msg = msg.replace(/<alname>/g, fields.alname);
        msg = msg.replace(/<atel>/g, fields.atel);
        msg = msg.replace(/<aposition>/g, fields.aposition);
        msg = msg.replace(/<aemail>/g, fields.aemail);
        msg = msg.replace(/<abusname>/g, fields.abusname);
        msg = msg.replace(/\n/g, "<br>");
        return msg;
    }
});