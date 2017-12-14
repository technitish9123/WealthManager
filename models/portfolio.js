module.exports = (function () {
    function PortFolio(context) {
        if (!context) {
            return;
        }

        this.id = context.id;
        this.name = context.name;
        this.txns = context.txns;
        this.cashAmount = context.cashAmount;
    }
    PortFolio.prototype.getUser = function () {
        return `User Id: ${this.userId}`;;
    };
    return PortFolio;
}());