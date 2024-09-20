


export const createReturn = (req, res, next) => {
  try {
    // CHECKING FOR REQUIRED FIELDS
    const {
      branchId,
      buyerId,
      partyName,
      serialNumber,
      phone,
      date,
      Return_by,
      suits_data,
    } = req.body;
    const requiredFields = [
      "branchId",
      "buyerId",
      "partyName",
      "serialNumber",
      "phone",
      "date",
      "suits_data",
    ];
    const requiredSuitsFields = ["id", "d_no", "color", "quantity", "price"];
    const missingFields = [];

    requiredFields.forEach((field) => {
      if (!req.body[field]) {
        missingFields.push(field);
      }
      if (field === "suits_data") {
        suits_data.forEach((suit, index) => {
          requiredSuitsFields.forEach((requiredField) => {
            if (!suit[requiredField]) {
              missingFields.push(
                `Suit No ${index + 1} is missing ${requiredField}`
              );
            }
          });
        });
      }
    });
    if (missingFields.length > 0) {
      throw new Error(`Missing Fields: ${missingFields}`);
    };
    return res.status(400).json({ success:true , message : "Return Added Successfully" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
