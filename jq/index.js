
$("h1").addClass("col margin-50");

$("h1").click(function()
{
  $("h1").css("color","purple");
});

$("button").addClass("new-button");
$("button").click(function()
{
  $("h1").animate({opacity:0.5});
});
