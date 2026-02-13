export const generateWhatsAppLink = (number, type, data = {}) => {
    let message = "";
    const cleanNumber = number.replace(/\D/g, "");

    switch (type) {
        case "product":
            message = `Hi, I'm interested in ${data.name} priced at ₹${data.price}. Is it available?`;
            break;
        case "category":
            message = `Hi, I'm looking for ${data.category}. Can you suggest the best options?`;
            break;
        case "products":
            message = "Hi, I'm browsing your products. Can you help me choose the right furniture?";
            break;
        default:
            message = "Hi, I'm interested in your furniture collection. Can you share more details?";
    }

    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
};
