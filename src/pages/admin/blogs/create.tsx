import Layout from "@components/layout/layout";
import BlogForm from "@components/blog/BlogForm";
import Container from "@components/ui/container";
import withAdminAuth from "@components/auth/withAdminAuth";

function CreateBlogPage() {
  return (
    <Container>
      <div className="py-8">
        <BlogForm />
      </div>
    </Container>
  );
}

CreateBlogPage.Layout = Layout;

export default withAdminAuth(CreateBlogPage);
