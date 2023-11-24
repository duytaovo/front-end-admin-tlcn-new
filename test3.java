@Override
public void sendValidatorCode(SendValidatorCodeRequest request)[1] {
    User user = userRepository.findByPhoneNumber(request.getPhoneNumber());[2]
    if (user == null)[3] {
        throw new ResourceNotFoundException("User with " + request.getPhoneNumber() + " not exist!");[4]
    }
    if (!StringUtils.isEmpty(request.getEmail()) && !Objects.equals(user.getEmail(), request.getEmail()))[5] {
        throw new WarningException("Email Input not correct or user with phone number not active!");[6]
    }
    Random random = new Random();[7]
    String validatorCodeGenerate = String.valueOf(random.nextInt(999999 - 100000) + 100000);[8]
    UserValidator userValidator = UserValidator.builder()
            .user(user)
            .validatorCode(validatorCodeGenerate)
            .validatorType(request.getValidatorType())
            .build();[9]
    userValidatorRepository.save(userValidator);[9]
    mailService.sendMail(null , user.getEmail(), null, null,
            "Mã xác nhận của bạn là : " + validatorCodeGenerate);[10]
}
