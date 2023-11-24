@Override
public AddNewOrderResponse order(AddNewOrderRequest request, HttpServletRequest requestHttp)[1] {
    //validate check stock
    for (OrderProductDto data : request.getOrderProducts())[2] {
        if (!checkInventoryProductInStock(data.getProductId(), data.getTypeId(), data.getDepotId(), data.getQuantity()))[3] {
            throw new WarningException("Product is out of stock! or not exist in stock!");[4]
        }
    }

    User userOrder;[5]
    if (Objects.isNull(request.getUserId()))[6] {
        // create new user
        PasswordEncoder encoder = new BCryptPasswordEncoder();[7]
        Boolean checkExistUser = userRepository.existsByPhoneNumber(request.getPhoneReceiver());[8]
        if (!checkExistUser)[9] {
            userOrder = userRepository.saveAndFlush(User.builder()
                    .phoneNumber(request.getPhoneReceiver())
                    .fullName(request.getNameReceiver())
                    .address(request.getAddressReceiver())
                    .level(UserLevel.BRONZE.getKey())
                    .password(encoder.encode(Constants.DEFAULT_PASSWORD))
                    .isDeleted(Boolean.FALSE)
                    .build());[10]
        } else {
            userOrder = userRepository.findByPhoneNumber(request.getPhoneReceiver());[11]
        }

    } else {
        // check user exist
        userOrder = userRepository.findById(request.getUserId()).get();[12]
    }

    CreatePaymentVNPAYDto paymentVNPAYDto = new CreatePaymentVNPAYDto();[13]
    if (PaymentMethod.PAYMENT_ON_VNPAY.getKey().equals(request.getPaymentMethod()))[14] {
        String baseUrl = requestHttp.getScheme() + "://" + requestHttp.getServerName() + ":" + requestHttp.getServerPort();[15]
        paymentVNPAYDto = vnPayService.createPayment(request.getFinalPrice().toBigInteger(), request.getPhoneReceiver(), baseUrl);[16]
    }

    Payment payment = paymentRepository.save(Payment.builder()
            .method(PaymentMethod.getEnum(request.getPaymentMethod()).getValue())
            .paymentStatus(PaymentMethod.PAYMENT_ON_VNPAY.getKey().equals(request.getPaymentMethod())
                    ? PaymentStatus.PAYMENT_PENDING.getKey() : PaymentStatus.UNPAID.getKey())
            .paymentKey(paymentVNPAYDto.getVnp_TxnRef())
            .build());[17]

    TOrder order = orderRepository.saveAndFlush(TOrder.builder()
            .addressReceiver(request.getAddressReceiver())
            .nameReceiver(request.getNameReceiver())
            .phoneReceiver(request.getPhoneReceiver())
                    .message(request.getMessage())
                    .orderStatus(OrderStatus.ORDERED.getKey())
                    .orderPrice(request.getOrderPrice())
                    .deliveryPrice(request.getDeliveryPrice())
                    .discount(request.getDiscount())
                    .finalPrice(request.getFinalPrice())
                    .user(userOrder)
                    .payment(payment)
                    .isDeleted(Boolean.FALSE)
            .build());[18]

    for (OrderProductDto data : request.getOrderProducts())[19] {
        orderProductRepository.save(OrderProduct.builder()
                .product(productService.getExistProduct(data.getProductId()))
                .quantity(data.getQuantity())
                .order(order)
                .type(typeRepository.findById(data.getTypeId()).get())
                .depot(depotRepository.findByIdAndIsDeletedIsFalse(data.getDepotId()))
                .build());[20]
        Stock stock = stockRepository.findByProductIdAndTypeIdAndDepotId(data.getProductId(), data.getTypeId(), data.getDepotId());[21]
        stock.setQuantity(stock.getQuantity() - data.getQuantity());[22]
        stockRepository.save(stock);[23]
    }

    return AddNewOrderResponse.builder()
            .phoneNumber(userOrder.getPhoneNumber())
            .password(Constants.DEFAULT_PASSWORD)
            .orderStatusString(OrderStatus.ORDERED.getValue())
            .paymentUrl(paymentVNPAYDto.getPaymentUrl())
            .build();[24]
}
