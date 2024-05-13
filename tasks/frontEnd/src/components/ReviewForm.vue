<template>
  <Form @submit="handleSubmit">
    <TextField label="Shop name" v-model="review.shopName" autoComplete="off" required :error="shopNameError"></TextField>
    <TextField label="Product name" v-model="review.productName" autoComplete="off" :error="productNameError"></TextField>
    <TextField label="Your name" v-model="review.userName" autoComplete="off" :error="userNameError"></TextField>
    <TextField type="email" label="Your email" v-model="review.userEmail" autoComplete="email" :error="userEmailError"></TextField>
    <Text>Rating</Text>
    <InlineStack gap="200">
      <RadioButton v-for="n in 5" :label="n" :value="n" v-model="review.rating" :checked="review.rating == n" />
    </InlineStack>
    <TextField label="Review" v-model="review.reviewBody" :multiline="4" autoComplete="off" :error="reviewBodyError" />
    <Checkbox label="Verified review" v-model="review.verified" />
    <DropZone accept="image/*" type="image" @drop="handleDrop" label="Related images">
      <Layout v-if="review.files.length" vertical>
        <LayoutSection v-for="file, index in review.files" :key="index">
            <Thumbnail
              size="small"
              :alt="file.name"
              :source="getSource(file)"
            />
            <div>
              {{ file.name }}{{ ' ' }}
              <Text variant="bodySm" as="p">
                {{ file.size }} bytes
              </Text>
            </div>
        </LayoutSection>
      </Layout>
      <DropZoneFileUpload v-else actionTitle="Add review images" />
    </DropZone>
    <Divider />
    <Button type="submit" :disabled="disableSubmit">Submit</Button>
  </Form>
</template>

<script setup>
import { reactive, ref, watch } from 'vue';

const emit = defineEmits(['addReview'])

const review = reactive({ shopName: '', productName: '', userName: '', userEmail: '', rating: 3, reviewBody: '', verified: false, files: [] });

const shopNameError = ref(null);
const productNameError = ref(null);
const userNameError = ref(null);
const userEmailError = ref(null);
const reviewBodyError = ref(null);

const disableSubmit = ref(true);

watch(review, () => {
  if(shopNameError.value == '' && productNameError.value == '' && userNameError.value == '' && userEmailError.value == '' && reviewBodyError.value == '') {
    disableSubmit.value = false;
  } else {
    disableSubmit.value = true;
  }
});

watch(() => review.shopName, () => {
  if(review.shopName.length == 0) {
    shopNameError.value = 'This is a required field';
  } else {
    shopNameError.value = '';
  }
});

watch(() => review.productName, () => {
  if(review.productName.length == 0) {
    productNameError.value = 'This is a required field'
  } else {
    productNameError.value = '';
  }
});

watch(() => review.userName, () => {
  if(review.userName.length == 0) {
    userNameError.value = 'This is a required field'
  } else {
    userNameError.value = '';
  }
});

watch(() => review.userEmail, () => {
  if(review.userEmail.length == 0 || !(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(review.userEmail))) {
    userEmailError.value = 'Please provide a valid email';
  } else {
    userEmailError.value = '';
  }
});

watch(() => review.reviewBody, () => {
  if(review.reviewBody.length == 0) {
    reviewBodyError.value = 'This is a required field';
  } else {
    reviewBodyError.value = '';
  }
});

const handleSubmit = () => {
  let mockImages = [];
  for (let file in review.files) {
    mockImages = [...mockImages, 'https://loremflickr.com/640/480'];
  }
  const newReview = { 
    shopName: review.shopName, 
    productName: review.productName, 
    reviewer: { 
      name: review.userName,
      email: review.userEmail
    },
    review: { 
      rating: review.rating,
      reviewBody: review.reviewBody,
      reviewImages: mockImages, 
      verifiedPurchase: review.verified
    }
  };
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newReview)
  };
  fetch('https://663e3cbae1913c47679705a2.mockapi.io/api/v1/reviews', requestOptions )
    .then((res) => {
      if (res.ok) {
        emit('addReview');
      }
    });
}

const handleDrop = (_dropFiles, acceptedFiles, _rejectedFiles) => {
  review.files = [...review.files, ...acceptedFiles];
};

const getSource = (file) => {
  return window.URL.createObjectURL(file);
}
</script>
