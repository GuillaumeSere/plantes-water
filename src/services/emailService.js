import emailjs from '@emailjs/browser';

// Initialisation de EmailJS
emailjs.init("9Wd2D9zfV7aimnGD6"); // À remplacer par votre clé publique EmailJS

export const sendWateringReminder = async (plant, userEmail) => {
    try {
        const templateParams = {
            to_email: userEmail,
            from_name: "Plantes Water",
            to_name: userEmail.split('@')[0], // Utilise la partie avant @ comme nom
            plant_name: plant.name,
            watering_date: plant.startDate.toLocaleDateString(),
            water_amount: plant.waterAmount,
            reply_to: userEmail, // Permet à l'utilisateur de répondre à son propre email
        };

        await emailjs.send(
            "service_f2otagg", // À remplacer par votre Service ID EmailJS
            "template_qrq12if", // À remplacer par votre Template ID EmailJS
            templateParams,
            {
                to_email: userEmail, // Spécifie explicitement l'email de destination
            }
        );

        return true;
    } catch (error) {
        console.error("Erreur lors de l'envoi de l'email:", error);
        return false;
    }
}; 