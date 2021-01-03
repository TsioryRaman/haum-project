export const getProposedSymptoms = (symptoms = []) => {
    return ["Maux de tête","Diarhée"]
}

export const getDiagnosis  = (symptoms = []) => {
    return [{result: "Covid 19",accuracy:25,specialization:"maladie respiratoire"}]
}