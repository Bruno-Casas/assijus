package br.jus.trf2.assijus;

import org.json.JSONObject;

import com.crivano.restservlet.IRestAction;
import com.crivano.restservlet.PresentableException;
import com.crivano.restservlet.RestUtils;

public class ViewPost implements IRestAction {

	public void run(JSONObject req, final JSONObject resp) throws Exception {
		// Parse request
		String system = req.getString("system");
		String id = req.getString("id");
		String password = Utils.getPassword(system);

		String authkey = req.getString("authkey");
		String cpf = Utils.assertValidAuthKey(authkey, Utils.getUrlBluCServer());

		if (Utils.cacheRetrieve(cpf + "-" + system + "-" + id) == null)
			throw new PresentableException("CPF não autorizado.");

		String urlView = Utils.getUrl(system) + "/doc/" + id + "/pdf";
		// Call document repository hash webservice
		JSONObject gedresp = RestUtils.restGet("ged-view", password, urlView,
				"cpf", cpf);

		// Produce response
		String doc = gedresp.getString("doc");
		resp.put("payload", doc);
		resp.put("content-type", "application/pdf");
	}

	public String getContext() {
		return "obter o pdf";
	}
}
