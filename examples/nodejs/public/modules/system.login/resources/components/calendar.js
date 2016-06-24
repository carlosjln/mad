function component() {
    function calendar() {
        this.container = document.createElement('div');
    }
    
    calendar.prototype = {
        constructor: calendar,
        
        show: function() {
            this.container.style.display = 'block';
        },
        
        hide: function() {
            this.container.style.display = 'hidden';
        }
    };
    
    return calendar;
}