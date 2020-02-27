// Copyright 2017-2020, University of Colorado Boulder

/**
 * Panel that manages options for visibility of reference lines on vector screen.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import BracketNode from '../../../../scenery-phet/js/BracketNode.js';
import AlignBox from '../../../../scenery/js/nodes/AlignBox.js';
import AlignGroup from '../../../../scenery/js/nodes/AlignGroup.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import VerticalCheckboxGroup from '../../../../sun/js/VerticalCheckboxGroup.js';
import MassesAndSpringsConstants from '../../common/MassesAndSpringsConstants.js';
import massesAndSpringsStrings from '../../masses-and-springs-strings.js';
import massesAndSprings from '../../massesAndSprings.js';
import DisplacementArrowNode from './DisplacementArrowNode.js';

const displacementString = massesAndSpringsStrings.displacement;
const massEquilibriumString = massesAndSpringsStrings.massEquilibrium;
const movableLineString = massesAndSpringsStrings.movableLine;
const naturalLengthString = massesAndSpringsStrings.naturalLength;
const periodTraceString = massesAndSpringsStrings.periodTrace;

// constants
const DEFAULT_CONTENT_SPACING = 155;
const CONTENT_MAX_WIDTH = 115;

/**
 * @param {MassesAndSpringsModel} model
 * @param {Tandem} tandem
 * @param {Object} [options]
 * @constructor
 */
function IndicatorVisibilityControlNode( model, tandem, options ) {
  options = merge( {
    fill: MassesAndSpringsConstants.PANEL_FILL,
    tandem: tandem.createTandem( 'indicatorVisibilityControlNode' ),
    minWidth: MassesAndSpringsConstants.PANEL_MIN_WIDTH + 10,
    periodTraceOption: false
  }, options );

  Node.call( this, options );

  // Lines added for reference in panel
  const blackLine = MassesAndSpringsConstants.CREATE_LINE_ICON( 'black', tandem.createTandem( 'blackLine' ) );
  const blueLine = MassesAndSpringsConstants.CREATE_LINE_ICON( 'rgb( 65, 66, 232 )', tandem.createTandem( 'blueLine' ) );
  const redLine = MassesAndSpringsConstants.CREATE_LINE_ICON( 'red', tandem.createTandem( 'redLine' ) );

  const displacementSymbol = new DisplacementArrowNode(
    new NumberProperty( 10 ),
    new BooleanProperty( true ),
    tandem,
    {
      modelViewTransform: this.modelViewTransform,
      symbolRepresentation: true,
      scale: 0.65
    }
  );
  const alignGroup = new AlignGroup( { matchVertical: false } );

  // Labels for the displacement arrow and natural length line
  const displacementLabels = new VBox( {
    spacing: 8,
    align: 'left',
    children: [
      new Text( displacementString, {
        font: MassesAndSpringsConstants.TITLE_FONT,
        maxWidth: 110,
        tandem: tandem.createTandem( 'displacementString' )
      } ),
      new Text( naturalLengthString, {
        font: MassesAndSpringsConstants.TITLE_FONT,
        maxWidth: 110,
        tandem: tandem.createTandem( 'naturalLengthString' )
      } ) ]
  } );

  // the bracket at the left - this is tweaked a bit for optimal appearance
  const bracket = new VBox( {
    children: [
      new BracketNode( {
        orientation: 'left',
        bracketLength: displacementLabels.height < 17 ? 17 : displacementLabels.height,
        bracketLineWidth: 2,
        bracketStroke: 'black',
        bracketTipPosition: 0.475,
        bracketEndRadius: 4,
        bracketTipRadius: 4
      } )
    ]
  } );

  const componentDisplacement = new AlignBox( new HBox( {
    spacing: 2,
    children: [ bracket, displacementLabels ]
  } ), { xAlign: 'left', group: alignGroup } );

  const massEquilibriumAlignBox = new AlignBox( new Text( massEquilibriumString, {
    font: MassesAndSpringsConstants.TITLE_FONT,
    maxWidth: CONTENT_MAX_WIDTH,
    tandem: tandem.createTandem( 'massEquilibriumString' )
  } ), { xAlign: 'left', group: alignGroup } );
  const movableLineAlignBox = new AlignBox( new Text( movableLineString, {
    font: MassesAndSpringsConstants.TITLE_FONT,
    maxWidth: CONTENT_MAX_WIDTH,
    tandem: tandem.createTandem( 'movableLineString' )
  } ), { xAlign: 'left', group: alignGroup } );

  // Max width must be set to the maxWidth of the alignGroup based on its content.
  const contentSpacing = DEFAULT_CONTENT_SPACING - alignGroup.getMaxWidth();

  // Create checkboxes using align boxes above
  const componentDisplacementVBox = new VBox( { children: [ displacementSymbol, blueLine ] } );
  componentDisplacementVBox.spacing = componentDisplacementVBox.height * 0.75;

  // Used for indicator visibility
  const checkboxContent = [ {
    node: new HBox( {
      children: [ componentDisplacement, componentDisplacementVBox ],
      spacing: contentSpacing
    } ),
    property: model.naturalLengthVisibleProperty
  }, {
    node: new HBox( { children: [ massEquilibriumAlignBox, blackLine ], spacing: contentSpacing } ),
    property: model.equilibriumPositionVisibleProperty
  }, {
    node: new HBox( { children: [ movableLineAlignBox, redLine ], spacing: contentSpacing } ),
    property: model.movableLineVisibleProperty
  } ];
  let indicatorVisibilityCheckboxGroup = new VerticalCheckboxGroup( checkboxContent, {
    checkboxOptions: {
      boxWidth: 16,
      spacing: 8
    },
    tandem: tandem.createTandem( 'indicatorVisibilityCheckboxGroup' )
  } );

  if ( options.periodTraceOption ) {

    // Push period trace content into checkboxContent
    checkboxContent.push( {
      node: new Text( periodTraceString, {
        font: MassesAndSpringsConstants.TITLE_FONT,
        maxWidth: CONTENT_MAX_WIDTH,
        tandem: tandem.createTandem( 'periodTraceString' )
      } ),
      property: model.firstSpring.periodTraceVisibilityProperty
    } );

    indicatorVisibilityCheckboxGroup = new VerticalCheckboxGroup( checkboxContent, {
      checkboxOptions: {
        boxWidth: 16,
        spacing: 8
      },
      tandem: tandem.createTandem( 'indicatorVisibilityCheckboxGroup' )
    } );
  }
  const indicatorVisibilityControlsVBox = new VBox( {
      children: [
        indicatorVisibilityCheckboxGroup
      ],
      align: 'left',
      tandem: tandem.createTandem( 'indicatorVisibilityControlsVBox' )
    }
  );
  this.addChild( indicatorVisibilityControlsVBox );
}

massesAndSprings.register( 'IndicatorVisibilityControlNode', IndicatorVisibilityControlNode );

inherit( Node, IndicatorVisibilityControlNode );
export default IndicatorVisibilityControlNode;