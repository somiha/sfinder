$(document).ready(function () {
  $(".mobile-menu-icon").click(function () {
    $(".left-sidebar").addClass("open");
  });

  $(".sidebar-close-icon").click(function () {
    $(".left-sidebar").removeClass("open");
  });
});

function previewFile(input) {
  let inputFlied = $("#" + input);
  let image = inputFlied.parent().siblings("img").attr("id");
  var file = inputFlied.get(0).files[0];

  if (file) {
    var reader = new FileReader();

    reader.onload = function () {
      $("#" + image).attr("src", reader.result);
    };

    reader.readAsDataURL(file);
  }
}

function previewFileLink(input) {
  console.log("go");
  let inputFlied = $("#" + input);
  let image = inputFlied.parent().siblings("a").attr("id");
  var file = inputFlied.get(0).files[0];

  console.log(image);

  if (file) {
    var reader = new FileReader();

    reader.onload = function () {
      $("#" + image).attr("href", reader.result);
    };

    reader.readAsDataURL(file);
  }
}

const videoSrc = document.querySelector("#home-video-source");
const videoTag = document.querySelector("#home-video-tag");
const inputTag = document.querySelector("#home-video-input");

function previewVideo(event) {
  if (event.target.files && event.target.files[0]) {
    var reader = new FileReader();

    reader.onload = function (e) {
      videoSrc.src = e.target.result;
      videoTag.load();
    }.bind(this);

    reader.readAsDataURL(event.target.files[0]);
  }
}

$("#direct_order").change(function (event) {
  event.preventDefault();
  let optionSelected = $(this).find("option:selected");
  let valueSelected = optionSelected.val();
  if (valueSelected == 1) {
    $("#direct_product_title").prop("disabled", false);
  } else {
    $("#direct_product_title").prop("disabled", true);
  }
});

function seenMessage(id) {
  $.post(
    "https://sfinder.app/admin/change-message-status",
    { id: id },
    function (data, status) {
      console.log("success");
    }
  );
}

function seenFileRequest(id) {
  $.post(
    "https://sfinder.app/admin/change-file-request-status",
    { id: id },
    function (data, status) {
      console.log("success");
    }
  );
}

function seenPersonalRequest(id) {
  $.post(
    "https://sfinder.app/admin/change-personal-request-status",
    { id: id },
    function (data, status) {
      console.log("success");
    }
  );
}

const addMaterialform = document.getElementById("addMaterialform");
const addButton = document.getElementById("addMaterialformButton");

addMaterialform.addEventListener("submit", () => {
  // Disable the button
  addButton.disabled = true;
  addButton.textContent = "Uploading...";
});

function changeMaterial(id) {
  // Find the form using jQuery
  const $form = $(`#${id}`);

  // Find the submit button within the form
  const $submitButton = $form.siblings("button");

  if ($submitButton.length) {
    console.log("Submit button ID:", $submitButton.attr("id"));

    // Disable the button and update its text
    $submitButton.prop("disabled", true);
    $submitButton.text("Editing...");
  } else {
    console.error("Submit button not found in the form:", id);
  }
}
