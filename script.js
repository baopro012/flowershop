document.addEventListener('DOMContentLoaded', () => {
    // Khởi tạo Hero Slider
    const heroSlider = new Swiper('.hero-slider', {
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });

    // Khởi tạo Best Sellers Slider
    const bestSellersSlider = new Swiper('.best-sellers-slider', {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        breakpoints: {
            640: {
                slidesPerView: 2,
            },
            768: {
                slidesPerView: 3,
            },
            1024: {
                slidesPerView: 4,
            },
        },
    });

    // Khởi tạo Testimonials Slider
    const testimonialsSlider = new Swiper('.testimonials-slider', {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        breakpoints: {
            768: {
                slidesPerView: 2,
            },
            1024: {
                slidesPerView: 3,
            },
        },
    });

    // Khởi tạo giỏ hàng
    let cart = [];
    let currentProduct = null;
    updateCartCount();

    // Xử lý click vào sản phẩm để xem chi tiết
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Không mở modal chi tiết nếu click vào nút thêm vào giỏ
            if (e.target.classList.contains('add-to-cart')) {
                return;
            }
            
            const productName = card.querySelector('h3').textContent;
            const productPrice = card.querySelector('.price').textContent;
            const productImage = card.querySelector('img').src;
            const productDescription = card.querySelector('p:not(.price)').textContent;

            showProductDetail({
                name: productName,
                price: productPrice,
                image: productImage,
                description: productDescription
            });
        });
    });

    // Xử lý nút thêm vào giỏ hàng
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation(); // Ngăn không cho sự kiện click lan lên product-card
            const product = button.closest('.product-card');
            const productName = product.querySelector('h3').textContent;
            const productPrice = product.querySelector('.price').textContent;
            const productImage = product.querySelector('img').src;
            
            addToCart({
                name: productName,
                price: parseInt(productPrice.replace(/\D/g, '')),
                image: productImage,
                quantity: 1
            });

            button.textContent = 'Đã thêm vào giỏ';
            button.style.backgroundColor = '#4CAF50';
            
            setTimeout(() => {
                button.textContent = 'Thêm vào giỏ';
                button.style.backgroundColor = '#ff69b4';
            }, 2000);
        });
    });

    // Xử lý modal giỏ hàng
    const cartModal = document.getElementById('cart-modal');
    const cartIcon = document.getElementById('cart-icon');
    const closeButtons = document.querySelectorAll('.close');

    cartIcon.addEventListener('click', (e) => {
        e.preventDefault();
        cartModal.style.display = 'block';
        renderCart();
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            button.closest('.modal').style.display = 'none';
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });

    // Xử lý thanh toán
    const checkoutModal = document.getElementById('checkout-modal');
    const checkoutBtn = document.getElementById('checkout-btn');
    const checkoutForm = document.getElementById('checkout-form');
    const paymentMethod = document.getElementById('payment-method');
    const bankInfo = document.getElementById('bank-info');

    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Giỏ hàng của bạn đang trống!');
            return;
        }
        cartModal.style.display = 'none';
        checkoutModal.style.display = 'block';
    });

    paymentMethod.addEventListener('change', () => {
        bankInfo.classList.toggle('hidden', paymentMethod.value !== 'bank');
    });

    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(checkoutForm);
        const orderInfo = {
            name: formData.get('name'),
            phone: formData.get('phone'),
            address: formData.get('address'),
            paymentMethod: formData.get('payment-method'),
            items: cart,
            total: calculateTotal()
        };

        // Ở đây bạn có thể thêm code để gửi đơn hàng đến server
        console.log('Thông tin đơn hàng:', orderInfo);

        alert('Đặt hàng thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.');
        cart = [];
        updateCartCount();
        checkoutModal.style.display = 'none';
        checkoutForm.reset();
    });

    // Các hàm tiện ích
    function addToCart(product) {
        const existingItem = cart.find(item => item.name === product.name);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push(product);
        }
        updateCartCount();
    }

    function updateCartCount() {
        const cartCount = document.getElementById('cart-count');
        cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    }

    function calculateTotal() {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    function formatPrice(price) {
        return price.toLocaleString('vi-VN') + 'đ';
    }

    function renderCart() {
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">${formatPrice(item.price)}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus" onclick="updateQuantity('${item.name}', -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn plus" onclick="updateQuantity('${item.name}', 1)">+</button>
                        <span class="remove-item" onclick="removeItem('${item.name}')">🗑️</span>
                    </div>
                </div>
            </div>
        `).join('');

        cartTotal.textContent = formatPrice(calculateTotal());
    }

    // Thêm các hàm vào window object để có thể gọi từ HTML
    window.updateQuantity = (productName, change) => {
        const item = cart.find(item => item.name === productName);
        if (item) {
            item.quantity += change;
            if (item.quantity < 1) {
                removeItem(productName);
            } else {
                updateCartCount();
                renderCart();
            }
        }
    };

    window.removeItem = (productName) => {
        cart = cart.filter(item => item.name !== productName);
        updateCartCount();
        renderCart();
    };

    // Hiệu ứng smooth scroll cho các liên kết
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if (this.getAttribute('href') === '#') return;
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Hiệu ứng hiển thị header khi scroll
    let lastScrollTop = 0;
    const header = document.querySelector('header');

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });

    // Thêm các hàm xử lý chi tiết sản phẩm
    function showProductDetail(product) {
        currentProduct = product;
        const modal = document.getElementById('product-modal');
        const modalImage = document.getElementById('modal-product-image');
        const modalName = document.getElementById('modal-product-name');
        const modalDescription = document.getElementById('modal-product-description');
        const modalPrice = document.getElementById('modal-product-price');
        const quantityInput = document.getElementById('quantity');

        modalImage.src = product.image;
        modalImage.alt = product.name;
        modalName.textContent = product.name;
        modalDescription.textContent = product.description;
        modalPrice.textContent = product.price;
        quantityInput.value = 1;

        modal.style.display = 'block';
    }

    // Thêm các hàm điều khiển số lượng vào window object
    window.increaseQuantity = () => {
        const quantityInput = document.getElementById('quantity');
        quantityInput.value = parseInt(quantityInput.value) + 1;
    };

    window.decreaseQuantity = () => {
        const quantityInput = document.getElementById('quantity');
        const newValue = parseInt(quantityInput.value) - 1;
        if (newValue >= 1) {
            quantityInput.value = newValue;
        }
    };

    window.addToCartFromDetail = () => {
        if (!currentProduct) return;

        const quantity = parseInt(document.getElementById('quantity').value);
        addToCart({
            name: currentProduct.name,
            price: parseInt(currentProduct.price.replace(/\D/g, '')),
            image: currentProduct.image,
            quantity: quantity
        });

        const modal = document.getElementById('product-modal');
        modal.style.display = 'none';

        // Hiển thị thông báo thành công
        alert(`Đã thêm ${quantity} ${currentProduct.name} vào giỏ hàng!`);
    };

    // Blog Functions
    function searchBlog() {
        const searchInput = document.getElementById('blog-search');
        const searchTerm = searchInput.value.toLowerCase();
        const blogPosts = document.querySelectorAll('.blog-card');

        blogPosts.forEach(post => {
            const title = post.querySelector('.blog-title').textContent.toLowerCase();
            const content = post.querySelector('.blog-excerpt').textContent.toLowerCase();
            const category = post.querySelector('.blog-category').textContent.toLowerCase();

            if (title.includes(searchTerm) || content.includes(searchTerm) || category.includes(searchTerm)) {
                post.style.display = 'block';
            } else {
                post.style.display = 'none';
            }
        });
    }

    // Filter blog posts by category
    document.querySelectorAll('.filter-button').forEach(button => {
        button.addEventListener('click', () => {
            const category = button.getAttribute('data-category');
            const posts = document.querySelectorAll('.blog-card');

            // Update active button
            document.querySelectorAll('.filter-button').forEach(btn => {
                btn.classList.remove('active');
            });
            button.classList.add('active');

            // Filter posts
            posts.forEach(post => {
                if (category === 'all' || post.getAttribute('data-category') === category) {
                    post.style.display = 'block';
                } else {
                    post.style.display = 'none';
                }
            });
        });
    });

    // Blog post modal
    const blogModal = document.getElementById('blog-modal');
    const blogPosts = {
        'featured-post': {
            title: 'Nghệ Thuật Cắm Hoa: Từ Cơ Bản Đến Nâng Cao',
            image: 'images/red-roses.jpg',
            content: `<p>Nghệ thuật cắm hoa là một kỹ năng tuyệt vời để trang trí không gian sống và thể hiện sự sáng tạo của bạn. Trong bài viết này, chúng ta sẽ khám phá các kỹ thuật cắm hoa từ cơ bản đến nâng cao.</p>
                      <h3>1. Chuẩn bị dụng cụ</h3>
                      <p>Để cắm hoa đẹp, bạn cần chuẩn bị:</p>
                      <ul>
                          <li>Kéo cắt hoa chuyên dụng</li>
                          <li>Bình hoặc lọ hoa phù hợp</li>
                          <li>Xốp cắm hoa</li>
                          <li>Dây buộc</li>
                      </ul>
                      <h3>2. Chọn hoa và phụ kiện</h3>
                      <p>Việc chọn hoa và phụ kiện phù hợp sẽ quyết định 50% thành công của tác phẩm...</p>`,
            meta: '<span><i class="far fa-calendar"></i> 10/03/2024</span><span><i class="far fa-clock"></i> 10 phút đọc</span><span><i class="far fa-comment"></i> 15 bình luận</span>'
        },
        'post1': {
            title: 'Bí Quyết Chăm Sóc Hoa Ly Luôn Tươi Đẹp',
            image: 'images/lily.jpg',
            content: `<p>Hoa ly là một trong những loài hoa được yêu thích nhất vì vẻ đẹp và hương thơm độc đáo. Để giữ cho hoa ly luôn tươi đẹp, bạn cần lưu ý những điểm sau:</p>
                      <h3>1. Chọn hoa ly</h3>
                      <p>Khi chọn hoa ly, hãy chọn những nụ hoa còn săn chắc, màu sắc tươi sáng...</p>`,
            meta: '<span><i class="far fa-calendar"></i> 09/03/2024</span><span><i class="far fa-clock"></i> 5 phút đọc</span>'
        },
        // Thêm các bài viết khác tương tự
    };

    function showBlogPost(postId) {
        const post = blogPosts[postId];
        if (!post) return;

        document.getElementById('modal-blog-title').textContent = post.title;
        document.getElementById('modal-blog-image').src = post.image;
        document.getElementById('modal-blog-image').alt = post.title;
        document.getElementById('modal-blog-content').innerHTML = post.content;
        document.getElementById('modal-blog-meta').innerHTML = post.meta;

        blogModal.style.display = 'block';
    }

    // Comment system
    document.getElementById('comment-form')?.addEventListener('submit', function(e) {
        e.preventDefault();
        const commentText = this.querySelector('textarea').value;
        if (!commentText.trim()) return;

        const commentsList = document.getElementById('comments-list');
        const newComment = document.createElement('div');
        newComment.className = 'comment-item';
        newComment.innerHTML = `
            <div class="comment-author">Khách</div>
            <div class="comment-date">${new Date().toLocaleDateString()}</div>
            <div class="comment-text">${commentText}</div>
        `;

        commentsList.insertBefore(newComment, commentsList.firstChild);
        this.querySelector('textarea').value = '';
    });

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === blogModal) {
            blogModal.style.display = 'none';
        }
    });
}); 