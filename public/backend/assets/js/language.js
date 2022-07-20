$(function () {
    const content = $('.translation-content');
    const registerEventListeners = () => {

        content.on('change', function () {
            let selectEle = $(this);
            const group = $(this).data('group');
            const locale = $(this).data('locale');
            let $tr = selectEle.parent().next('td').find('select').val();
            let $prev = selectEle.parent().prev().text();
            let translatedWord = selectEle.val();
            updateText($prev, translatedWord, $(this).data('href'), group, locale, $tr)
        })
    };
    registerEventListeners();
    const updateText = (word, value, url, group, locale, page_url) => {
        if (value == '') {
            return false;
        }
        $.ajax({
            url,
            type: 'post',
            data: {
                word,
                translation: value,
                group: group,
                language: locale,
                page_url: page_url
            },
            success: () => {
                $.toast({
                    heading: '成功',
                    text: '更新が完了しました。',
                    showHideTransition: 'plain',
                    icon: 'success',
                    position: 'bottom-center',
                })
            },
            error: () => {
                $.toast({
                    heading: 'エラー',
                    text: 'Something went wrong.',
                    showHideTransition: 'plain',
                    icon: 'error',
                    position: 'bottom-center',
                })
            },
        })
    };
    $(".tr_clone_add").on('click', function () {
        var $tr = $(this).closest('.tr_clone');
        let c = $tr.clone().append("<td><span class='fa fa-trash-alt rmv cursor-pointer'></span></td>");
        c.find(".tr_clone_add").remove();
        c.find(".tr-plus").remove();
        c.find(".sn").text('new');
        c.find(".translation-content").attr('onchange', 'changeWord(this)');
        c.addClass('selected');
        $tr.after(c);
    });
    $('#translationsTbl').on('click', '.rmv', function () {
        $(this).closest('tr').remove();
    });

    $(".js-example-tags").select2({
        tags: true
    });
    $("#field_type").change(function () {
        $('#field_name').val('').trigger('change');
    });

    $('body').on('change', 'select', function () {
        let selectEle = $(this);
        if (selectEle[0] && selectEle[0].classList.contains('page-value')) {
            let $tr = selectEle.closest('.tr_clone');
            let word = $tr.find('td:eq(1)').text();
            let trans = $tr.find('.translation-content').val();
            let page_url = $(this).val();
            let url = '/languages/update';

            $.ajax({
                url,
                type: 'post',
                data: {
                    word: word,
                    translation: trans,
                    group: 'backend',
                    language: 'ja',
                    page_url: page_url != 'global' ? page_url : null
                },
                success: () => {
                    $.toast({
                        heading: '成功',
                        text: '更新が完了しました。',
                        showHideTransition: 'plain',
                        icon: 'success',
                        position: 'bottom-center',
                    })
                },
                error: () => {
                    $.toast({
                        heading: 'エラー',
                        text: 'Something went wrong.',
                        showHideTransition: 'plain',
                        icon: 'error',
                        position: 'bottom-center',
                    })
                },
            })
        }
    });
});