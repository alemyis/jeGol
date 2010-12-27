
JeGol.addUpdatePlugins('subject',
{
     DoUpdate: function(msgTitle)
     {
          $("#jegol_topic").html(msgTitle);
          return false;
     }
});


