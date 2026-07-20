// WhatsApp notification simulator
exports.sendWhatsAppNotification = async (phone, message) => {
  console.log(`\n======================================================`);
  console.log(`[WHATSAPP SIMULATOR] Sending message to ${phone}:`);
  console.log(`Message: "${message}"`);
  console.log(`======================================================\n`);
  return true;
};
