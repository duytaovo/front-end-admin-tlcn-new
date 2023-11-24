1.	@PostMapping("/admin/product/insert/all")
2.	private ResponseEntity<SuccessResponse> insertProductJson(HttpServletRequest request,
3.	                                             @RequestBody ProductFromJson productReq){ [1]
4.	        UserEntity user = authorizationHeader.AuthorizationHeader(request);[2]
5.	        if(user != null) [3]{
6.	            BrandEntity brand = brandService.findById(productReq.getBrand());[4]
7.	            if(brand == null)[5]
8.	                return new ResponseEntity<>(new SuccessResponse(false,
9.	                        HttpStatus.NOT_FOUND.value(),"Brand is Not Found",
10.	                        null), HttpStatus.NOT_FOUND);[6]
11.	            CategoryEntity category = categoryService.findById(productReq.getCategory());[7]
12.	            if(category == null)[8]
13.	                return new ResponseEntity<>(new SuccessResponse(false,
14.	                        HttpStatus.NOT_FOUND.value(),"Category is Not Found",
15.	                        null), HttpStatus.NOT_FOUND);[9]
16.	            Set<AttributeOptionEntity> listAttributeOption = new HashSet<>();[10]
17.	            for (String attributeOptionId : productReq.getAttribute()){[11]
18.	                AttributeOptionEntity attributeOption = attributeService
19.	                                     .findByIdAttributeOption(attributeOptionId);[12]
20.	                if(attributeOption == null)[13]
21.	                    return new ResponseEntity<>(new SuccessResponse(false,
22.	                            HttpStatus.NOT_FOUND.value(),"Attribute Options is Not Found",
23.	                            null), HttpStatus.NOT_FOUND);[14]
24.	                else
25.	                    listAttributeOption.add(attributeOption);[15]
26.	            }
27.	            ProductEntity product = ProductMapping.addJsonProductToEntity(productReq,
28.	                                                   category,brand,listAttributeOption);[16]
29.	            productService.saveProduct(product);[17]
30.	            return new ResponseEntity<>(new SuccessResponse(true,
31.	                    HttpStatus.OK.value(),"Add Product Successfully",
32.	                    null), HttpStatus.OK);[18]
33.	        }
34.	        else
35.	            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);[19]
36.	    }
