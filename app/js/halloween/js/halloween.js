/**
 *
 * All credits go to :
 * - Ivank, http://lib.ivank.net/, see http://lib.ivank.net/?p=demos&d=box2D
 * - Halloween icons from www.softicons.com
 *
 */

(function($, window, _, Box2D) {

    var stage = {}, // from Ivank
        actors= [],
        world= {}, // from Box2D
        bodies= [],
        up = {}
        ;

    var	b2Vec2		    = Box2D.Common.Math.b2Vec2,
        b2World		    = Box2D.Dynamics.b2World,
        b2BodyDef	    = Box2D.Dynamics.b2BodyDef,
        b2Body		    = Box2D.Dynamics.b2Body,
        b2FixtureDef    = Box2D.Dynamics.b2FixtureDef,
        b2PolygonShape	= Box2D.Collision.Shapes.b2PolygonShape,
        b2CircleShape	= Box2D.Collision.Shapes.b2CircleShape;

    var circleFixDef	= new b2FixtureDef();
    circleFixDef.shape	= new b2CircleShape();
    circleFixDef.density = 1;

    // 1 meter = 100 pixels
    var rectFixDef = new b2FixtureDef();
    rectFixDef.shape = new b2PolygonShape();
    rectFixDef.density = 1;

    var bodyDef = new b2BodyDef();

    var pictureExtension = window.chrome ? '.webp' : '.png';

    function getUrl(pictureName) {
        return 'img/' + pictureName + pictureExtension;
    }

    function getUrls(pictureStr) {
        return pictureStr
            .split(' ')
            .map(function(pictureName) {
                return getUrl(pictureName);
            });
    }

    var picturePumpkins = getUrls('Angry Cool Hysterical Laugh Pirate PirateCaptain pumpkin Smile Wink');
    var pictureDeads = getUrls('devil dracula frankenstein ghost hellboy mummy radioactive skull zombie');
    var pictureAlls = picturePumpkins.concat(pictureDeads);

    function createDynamicProp(pictureUrl) {
        if (bodies.length > 50) { // let's create until 50 bodies
            return;
        }

        bodyDef.type = b2Body.b2_dynamicBody;

        var random = Math.random()*0.45;
        var hw = 0.1 + (random < 0.2 ? 0.2: random);	// "half width"
        circleFixDef.shape.SetRadius(hw);

        bodyDef.position.Set(Math.random()*7, -5 + Math.random()*5);

        var body = world.CreateBody(bodyDef);
        body.CreateFixture(circleFixDef);
        bodies.push(body);

        var bm = new Bitmap(new BitmapData(pictureUrl));
        bm.x = bm.y = -100;

        var actor = new Sprite();
        actor.addChild(bm);
        actor.scaleX = actor.scaleY = hw;

        actor.addEventListener(MouseEvent.MOUSE_MOVE, jump);
        stage.addChild(actor);
        actors.push(actor);
    }

    function getRandom(array) {
        var min = 0;
        var max = array.length; // excl
        var idx = Math.floor(Math.random() * (max - min) + min);
        return array[idx];
    }

    var staticProps = [
        { name: 'Cauldron',
          getW: function(stageW) { return stageW / 300;  },
          getH: function(stageH) { return stageH / 100 - 0.5; },
          onClick: function() { _(2).times(function() { createDynamicProp(getRandom(picturePumpkins)); }); }
        },
        { name: 'Tomb',
          getW: function(stageW) { return stageW *2 / 300; },
          getH: function(stageH) { return stageH / 100 - 0.4; },
          onClick: function() { _(2).times(function() { createDynamicProp(getRandom(pictureDeads)); }); }
        },
        { name: 'Skull_and_bones',
          getW: function(stageW) { return stageW / 100 - 0.7; },
          getH: function(stageH) { return 0.6; },
          onClick: function() { clear(); }
        }
    ];

    function onEF(e) {
        world.Step(1 / 60,  3,  3);
        world.ClearForces();

        for(var i = 0, n = actors.length; i < n; i++) {
            var body  = bodies[i];
            var actor = actors [i];
            var p = body.GetPosition();
            actor.x = p.x *100;	// updating actor
            actor.y = p.y *100;
            actor.rotation = body.GetAngle()*180/Math.PI;
        }
    }

    function onEFforStaticProps(e) {
        _.each(staticProps, function(prop) {
            var body = prop.body;
            var actor = prop.actor;

            var p = body.GetPosition();
            actor.x = p.x *100;	// updating actor
            actor.y = p.y *100;
        });

        stage.removeEventListener(Event.ENTER_FRAME, onEFforStaticProps);
    }

    function clear() {
        stage.removeEventListener(Event.ENTER_FRAME, onEF);
        stage.removeEventListener(Event.ENTER_FRAME, onEFforStaticProps);

        bodies = [];
        actors = [];

        for (var i = stage.numChildren - 1; i > -1; i--) {
            stage.removeChildAt(i);
        }

        for (var body = world.GetBodyList(); body; body = body.GetNext()) {
            world.DestroyBody(body);
        }

        $(window).unbind('beforeunload', clear);
        $(window).off('resize', clear);

        var isInFrame = window.location !== window.parent.location;
        if (isInFrame) {
            window.parent.postMessage('DELETE_HALLOWEEN', '*');
        }
    }

    function jump(e) {
        var a = e.currentTarget; // current actor
        var i = actors.indexOf(a);
        //  cursor might be over ball bitmap, but not over a real ball
        if(Math.sqrt(a.mouseX*a.mouseX + a.mouseY*a.mouseY) > 100) return;
        bodies[i].ApplyImpulse(up, bodies[i].GetWorldCenter());
    }

    function start() {

        $(window).bind('beforeunload', clear);
        $(window).resize(clear);

        stage = new Stage('halloween_canvas');

        world = new b2World(new b2Vec2(0, 10),  true);
        up = new b2Vec2(0, -2.5);

        bodyDef.type = b2Body.b2_staticBody;

        // create ground
        rectFixDef.shape.SetAsBox(10, 1);
        bodyDef.position.Set(9, stage.stageHeight/100 + 1);
        var ground = world.CreateBody(bodyDef);
        ground.CreateFixture(rectFixDef);

        // walls
        rectFixDef.shape.SetAsBox(1, 100);

        bodyDef.position.Set(-1, 3);
        var leftWall = world.CreateBody(bodyDef);
        leftWall.CreateFixture(rectFixDef);

        bodyDef.position.Set(stage.stageWidth/100 + 1, 3);
        var rightWall = world.CreateBody(bodyDef);
        rightWall.CreateFixture(rectFixDef);

        // static props
        rectFixDef.shape.SetAsBox(0.55, 0.55);
        _.each(staticProps, function(prop) {

            var posW = prop.getW(stage.stageWidth);
            var posH = prop.getH(stage.stageHeight);
            bodyDef.position.Set(posW, posH);

            prop.body = world.CreateBody(bodyDef);
            prop.body.CreateFixture(rectFixDef);

            var bm = new Bitmap(new BitmapData(getUrl(prop.name)));
            bm.x = bm.y = -100;

            prop.actor = new Sprite();
            prop.actor.addChild(bm);
            prop.actor.scaleX = prop.actor.scaleY = 0.55;
            stage.addChild(prop.actor);

            prop.actor.addEventListener(MouseEvent.CLICK, prop.onClick);
        });

        // dynamic props
        _(30).times(function(i) {
            createDynamicProp(pictureAlls[i % pictureAlls.length]);
        });

        stage.addEventListener(Event.ENTER_FRAME, onEF);
        stage.addEventListener(Event.ENTER_FRAME, onEFforStaticProps);

    }

    start();

})(jQuery, window, _, Box2D);
